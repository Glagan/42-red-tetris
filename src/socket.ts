import type Player from '$client/lib/Player';
import type Room from '$client/lib/Room';

export type BasicError = { message: string };

export interface ClientToServerEvents {
	// * Room
	'room:getAll': (callback: (rooms: Room[]) => void) => void;
	'room:get': (roomId: string, callback: (room: Room | BasicError | null) => void) => void;
	'room:create': (name: string, callback: (room: Room | BasicError) => void) => void;
	'room:join': (roomId: string, callback: (room: Room | BasicError | null) => void) => void;
	'room:leave': () => void;
	// * Game
	'game:test': () => void;
}

export interface ServerToClientEvents {
	// * Room
	'room:all': (rooms: Room[]) => void;
	'room:created': (room: Room) => void;
	'room:playerJoined': (player: Player, room: Room) => void;
	'room:playerLeft': (player: Player, room: Room) => void;
	'room:deleted': (roomId: string) => void;
	'room:current': (roomId: string | null) => void;
}
