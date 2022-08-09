import { nanoid } from 'nanoid';
import type Room from '$server/lib/Room';
import type { Player as ClientPlayer } from '$client/lib/Player';
import type { TypedSocket } from '../../socket';
import WebSocket from '$server/lib/SocketIO';

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
		if (this.socket) {
			this.socket.join?.(room.socketRoom);
		}
		WebSocket.server.emit('room:playerJoined', this.toClient(), room.toClient());
	}

	leaveCurrentRoom() {
		if (this.room) {
			const previousRoom = this.room;
			if (this.socket) {
				this.socket.leave(previousRoom.socketRoom);
			}
			WebSocket.server.emit('room:playerLeft', this.toClient(), previousRoom.toClient());
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
			room: this.room?.id,
			status: this.socket !== undefined
		};
	}
}
