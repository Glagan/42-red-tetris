import type GameBoard from '$client/lib/GameBoard';
import type GamePiece from '$client/lib/GamePiece';
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
	'room:leave': (callback: (success: boolean | BasicError) => void) => void;
	'room:ready': (callback: (success: boolean | BasicError) => void) => void;
	'room:search': (query: string, callback: (rooms: Room[] | BasicError) => void) => void;
	// * Game
	'game:test': () => void;
	'game:move:left': (callback?: (ok: boolean) => void) => void;
	'game:move:right': (callback?: (ok: boolean) => void) => void;
	'game:rotate:clockwise': (callback?: (ok: boolean) => void) => void;
	'game:rotate:counter-clockwise': (callback?: (ok: boolean) => void) => void;
	'game:dash': (callback?: (ok: boolean) => void) => void;
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
	// * Game
	'game:startIn': (seconds: number) => void;
	'game:start': () => void;
	'game:tick': (tick: number) => void;
	'game:over': (winner: number) => void;
	'game:piece': (piece: GamePiece) => void;
	'game:board': (board: GameBoard) => void;
}
