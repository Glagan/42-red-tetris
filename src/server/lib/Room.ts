import { nanoid } from 'nanoid';
import type Player from '$server/lib/Player';
import type { Room as ClientRoom } from '$client/lib/Room';
import Game from './Game';
import { ioServer } from './SocketIO';

export default class Room {
	id: string;
	name: string;
	players: Player[];
	ready: string[];
	game?: Game;
	winner: number;
	playersIndex: Record<string, number>;

	constructor(name: string) {
		this.id = nanoid();
		this.name = name;
		this.players = [];
		this.ready = [];
		this.winner = 0;
		this.playersIndex = {};
	}

	addPlayer(player: Player) {
		this.players.push(player);
	}

	removePlayer(playerId: string) {
		const index = this.players.findIndex((player) => player.id === playerId);
		if (index >= 0) {
			this.players.splice(index, 1);
		}
		const readyIndex = this.ready.indexOf(playerId);
		if (readyIndex >= 0) {
			this.ready.splice(readyIndex, 1);
		}
	}

	isFull() {
		return this.players.length >= 2;
	}

	isEmpty() {
		return this.players.length === 0;
	}

	markPlayerAsReady(playerId: string) {
		const index = this.players.findIndex((player) => player.id === playerId);
		if (index >= 0) {
			this.ready.push(playerId);
		}
	}

	allPlayersReady() {
		return this.players.length == this.ready.length;
	}

	createGame() {
		if (this.players.length > 0) {
			this.playersIndex = {};
			for (let index = 0; index < this.players.length; index++) {
				const player = this.players[index];
				this.playersIndex[player.id] = index;
			}
			this.winner = -1;
			this.game = new Game(`room:${this.id}`, this.players.length);
			this.game.onCompletion = (winner) => {
				this.winner = winner;
			};
			this.ready = [];
			// Start game after 5s
			let count = 0;
			const interval = setInterval(() => {
				if (count == 5) {
					clearInterval(interval);
					ioServer.to(`room:${this.id}`).emit('game:start');
					this.startGame();
				} else {
					ioServer.to(`room:${this.id}`).emit('game:startIn', 5 - count);
				}
				count += 1;
			}, 1000);
		}
	}

	startGame() {
		if (this.game) {
			this.game.start();
		}
	}

	isPlaying() {
		return this.game && this.winner < 0;
	}

	toClient(): ClientRoom {
		return {
			id: this.id,
			name: this.name,
			players: this.players.map((player) => ({
				id: player.id,
				name: player.name
			}))
		};
	}
}
