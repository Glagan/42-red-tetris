import type Player from '$client/lib/Player';
import type Room from '$client/lib/Room';

export interface ClientToServerEvents {
	// * Room
	'room:getAll': (callback: (rooms: Room[]) => void) => void;
	'room:get': (roomId: string, callback: (rooms: Room | undefined) => void) => void;
	'room:create': (name: string, callback: (room: Room) => void) => void;
	'room:join': (roomId: string, callback: (room: Room | undefined) => void) => void;
	'room:leave': () => void;
}

export interface ServerToClientEvents {
	// * Room
	'room:all': (rooms: Room[]) => void;
	'room:created': (room: Room) => void;
	'room:joined': (user: Player, room: Room) => void;
	'room:deleted': (roomId: string) => void;
}
