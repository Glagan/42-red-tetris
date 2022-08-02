import { nanoid } from 'nanoid';
import type Player from '$lib/Player';

export default class Room {
	id: string;
	name: string;
	players: Player[];

	constructor(name: string) {
		this.id = nanoid();
		this.name = name;
		this.players = [];
	}

	addPlayer(player: Player) {
		this.players.push(player);
	}

	removePlayer(playerOrIdentifier: Player | string) {
		const index = this.players.findIndex(
			(player) => player === playerOrIdentifier || player.id === playerOrIdentifier
		);
		if (index >= 0) {
			this.players.splice(index, 1);
		}
	}
}
