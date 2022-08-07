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
		this.winner = -1;
		this.playersIndex = {};
	}

	addPlayer(player: Player) {
		if (
			this.players.length < 2 &&
			this.players.findIndex((playerInRoom) => playerInRoom.id == player.id) < 0
		) {
			this.players.push(player);
			return true;
		}
		return false;
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

	togglePlayerAsReady(playerId: string) {
		const index = this.players.findIndex((player) => player.id === playerId);
		if (index >= 0) {
			const readyIndex = this.ready.indexOf(playerId);
			if (readyIndex >= 0) {
				this.ready.splice(readyIndex, 1);
				return false;
			} else {
				this.ready.push(playerId);
				return true;
			}
		}
		return false;
	}

	allPlayersReady() {
		return this.players.length > 0 && this.players.length == this.ready.length;
	}

	createGame() {
		if (this.allPlayersReady()) {
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
				if (this.game?.paused === false || count == 5) {
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
		if (this.game && this.game.paused) {
			this.game.start();
		}
	}

	stopGame() {
		if (this.game && !this.game.paused) {
			this.game.stop();
		}
	}

	pauseGame() {
		return this.stopGame();
	}

	/**
	 * Check if a game exist for the rooom and is not over
	 * It does *not* check if the game is actually "playing",
	 * meaning that it returns true when the game still show "Starting in X seconds"
	 * @returns true if a game exist and is not over
	 */
	isPlaying() {
		return this.game !== undefined && this.winner < 0;
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
