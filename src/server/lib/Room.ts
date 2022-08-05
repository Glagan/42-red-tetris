import { nanoid } from 'nanoid';
import type Player from '$server/lib/Player';
import { DateTime } from 'luxon';
import type { Room as ClientRoom } from '$client/lib/Room';
import Game from './Game';

export default class Room {
	id: string;
	name: string;
	players: Player[];
	ready: string[];
	createdAt: DateTime;
	lastUpdate: DateTime;
	game?: Game;

	constructor(name: string) {
		this.id = nanoid();
		this.name = name;
		this.players = [];
		this.ready = [];
		this.createdAt = DateTime.now();
		this.lastUpdate = DateTime.now();
	}

	addPlayer(player: Player) {
		this.players.push(player);
		this.lastUpdate = DateTime.now();
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
		this.lastUpdate = DateTime.now();
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
		this.game = new Game();
	}

	startGame() {
		if (this.game) {
			this.game.start();
		}
	}

	toClient(): ClientRoom {
		return {
			id: this.id,
			name: this.name,
			players: this.players.map((player) => ({
				id: player.id,
				name: player.name
			})),
			createdAt: this.createdAt.toString(),
			lastUpdate: this.lastUpdate.toString()
		};
	}
}
