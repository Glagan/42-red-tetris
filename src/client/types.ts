import type Player from '$client/lib/Player';
import type Room from '$client/lib/Room';

export interface ClientToServerEvents {
	// * Room
	'room:create': (name: string) => void;
	'room:join': (roomId: string) => Room | undefined;
	'room:leave': () => void;
}

export interface ServerToClientEvents {
	// * Room
	'room:created': (room: Room) => void;
	'room:joined': (user: Player, room: Room) => void;
	'room:deleted': (roomId: string) => void;
}
