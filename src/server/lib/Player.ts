import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import type Room from '$server/lib/Room';
import type { Player as ClientPlayer } from '$client/lib/Player';

export default class Player {
	id: string;
	name: string;
	room?: Room;
	lastUpdate: DateTime;

	constructor(name: string) {
		this.id = nanoid();
		this.name = name;
		this.lastUpdate = DateTime.now();
	}

	joinRoom(room: Room) {
		this.room = room;
		room.addPlayer(this);
		this.lastUpdate = DateTime.now();
	}

	leaveCurrentRoom() {
		if (this.room) {
			const previousRoom = this.room;
			this.room.removePlayer(this.id);
			this.room.lastUpdate = DateTime.now();
			this.room = undefined;
			return previousRoom;
		}
		return undefined;
	}

	refresh() {
		this.lastUpdate = DateTime.now();
	}

	toClient(): ClientPlayer {
		return {
			id: this.id,
			name: this.name,
			room: this.room?.id
		};
	}
}
