import { nanoid } from 'nanoid';
import type Player from '$server/lib/Player';
import type { Room as ClientRoom } from '$client/lib/Room';
import Game from './Game';
import WebSocket from './SocketIO';

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

	get socketRoom() {
		return `room:${this.id}`;
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

	kickSecondPlayer() {
		if (this.players.length < 2 || this.isPlaying()) {
			return undefined;
		}
		this.ready = [];

		const firstPlayer = this.players[0];
		const secondPlayer = this.players[1];
		secondPlayer.leaveCurrentRoom();
		if (secondPlayer.socket) {
			secondPlayer.socket.emit('room:kicked');
		}
		this.players.splice(1, 1);

		WebSocket.server.to(this.socketRoom).emit('room:playerReady', firstPlayer.toClient(), false);
		return secondPlayer;
	}

	isFull() {
		return this.players.length >= 2;
	}

	isEmpty() {
		return this.players.length === 0;
	}

	togglePlayerAsReady(playerId: string) {
		const player = this.players.find((player) => player.id === playerId);
		if (player) {
			const readyIndex = this.ready.indexOf(playerId);
			if (readyIndex >= 0) {
				this.ready.splice(readyIndex, 1);
				WebSocket.server.to(this.socketRoom).emit('room:playerReady', player.toClient(), false);
				return false;
			} else {
				this.ready.push(playerId);
				WebSocket.server.to(this.socketRoom).emit('room:playerReady', player.toClient(), true);
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
			/* c8 ignore start */
			const interval = setInterval(() => {
				if (this.game?.paused === false || count == 5) {
					clearInterval(interval);
					this.startGame();
				} else {
					WebSocket.server.to(`room:${this.id}`).emit('game:startIn', 5 - count);
				}
				count += 1;
			}, 1000);
			/* c8 ignore end */
			WebSocket.server.to(this.socketRoom).emit(
				'room:gameCreated',
				{
					current: this.currentPiece(0),
					next: this.nextPieces(0)
				},
				{
					current: this.currentPiece(1),
					next: this.nextPieces(1)
				}
			);
		}
	}

	currentPiece(playerIndex: number) {
		const index = this.playersIndex[playerIndex];
		if (index !== undefined && this.game) {
			return this.game.currentPiece(index);
		}
		return undefined;
	}

	nextPieces(playerIndex: number) {
		const index = this.playersIndex[playerIndex];
		if (index !== undefined && this.game) {
			return this.game.nextPieces(index);
		}
		return [];
	}

	startGame() {
		if (this.game && this.game.paused) {
			WebSocket.server.to(`room:${this.id}`).emit('game:start');
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
			players: this.players.map((player) => player.toClient())
		};
	}
}
