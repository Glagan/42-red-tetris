import { nanoid } from 'nanoid';
import type Player from '$server/lib/Player';
import { DateTime } from 'luxon';
import type { Room as ClientRoom } from '$client/lib/Room';

export default class Room {
	id: string;
	name: string;
	players: Player[];
	createdAt: DateTime;
	lastUpdate: DateTime;

	constructor(name: string) {
		this.id = nanoid();
		this.name = name;
		this.players = [];
		this.createdAt = DateTime.now();
		this.lastUpdate = DateTime.now();
	}

	addPlayer(player: Player) {
		this.players.push(player);
		this.lastUpdate = DateTime.now();
	}

	removePlayer(playerOrIdentifier: Player | string) {
		const index = this.players.findIndex(
			(player) => player === playerOrIdentifier || player.id === playerOrIdentifier
		);
		if (index >= 0) {
			this.players.splice(index, 1);
		}
		this.lastUpdate = DateTime.now();
	}

	isFull() {
		return this.players.length >= 2;
	}

	isEmpty() {
		return this.players.length === 0;
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
