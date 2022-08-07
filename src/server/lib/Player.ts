import { nanoid } from 'nanoid';
import type Room from '$server/lib/Room';
import type { Player as ClientPlayer } from '$client/lib/Player';
import type { TypedSocket } from '../../socket';

export default class Player {
	id: string;
	name: string;
	room?: Room;
	socket?: TypedSocket;

	constructor(name: string) {
		this.id = nanoid();
		this.name = name;
	}

	joinRoom(room: Room) {
		this.room = room;
		room.addPlayer(this);
	}

	leaveCurrentRoom() {
		if (this.room) {
			const previousRoom = this.room;
			this.room.removePlayer(this.id);
			this.room = undefined;
			return previousRoom;
		}
		return undefined;
	}

	toClient(): ClientPlayer {
		return {
			id: this.id,
			name: this.name,
			room: this.room?.id
		};
	}
}
