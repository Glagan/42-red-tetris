import type Player from '$client/lib/Player';
import type Room from '$client/lib/Room';

export type BasicError = { message: string };

export interface ClientToServerEvents {
	// * Player
	'set:username': (username: string, callback: (success: boolean | BasicError) => void) => void;
	// * Room
	'room:getAll': (callback: (rooms: Room[]) => void) => void;
	'room:get': (roomId: string, callback: (room: Room | BasicError | null) => void) => void;
	'room:create': (name: string, callback: (room: Room | BasicError) => void) => void;
	'room:join': (roomId: string, callback: (room: Room | BasicError | null) => void) => void;
	'room:leave': () => void;
	'room:ready': (callback: (success: boolean | BasicError) => void) => void;
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
	'room:gameCreated': () => void;
}
