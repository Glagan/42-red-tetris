import type GameBoard from '$client/lib/GameBoard';
import type GamePiece from '$client/lib/GamePiece';
import type Player from '$client/lib/Player';
import type Room from '$client/lib/Room';
import type { Server, Socket } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type BasicError = { message: string };

export type SuccessWithError = <T extends boolean, E extends T extends false ? BasicError : null>(
	success: T,
	error?: E
) => void;

export type ValueWithError<T> = <E extends T extends null ? BasicError : null>(
	room: T,
	error?: E
) => void;

export interface ClientToServerEvents {
	// * Player
	'set:username': (username: string, callback: SuccessWithError) => void;
	// * Room
	'room:getAll': (callback: (rooms: Room[]) => void) => void;
	'room:get': (roomId: string, callback: ValueWithError<Room | null>) => void;
	'room:create': (name: string, callback: ValueWithError<Room | null>) => void;
	'room:join': (roomId: string, callback: ValueWithError<Room | null>) => void;
	'room:leave': (callback: SuccessWithError) => void;
	'room:ready': (callback: SuccessWithError) => void;
	'room:search': (
		query: string,
		callback: (rooms: Room[], error?: BasicError | null) => void
	) => void;
	// * Matchmaking
	'matchmaking:join': (callback: SuccessWithError) => void;
	'matchmaking:leave': (callback: SuccessWithError) => void;
	// * Game
	'game:test': () => void;
	'game:move:left': (callback?: (ok: boolean) => void) => void;
	'game:move:right': (callback?: (ok: boolean) => void) => void;
	'game:rotate:clockwise': (callback?: (ok: boolean) => void) => void;
	'game:rotate:counter-clockwise': (callback?: (ok: boolean) => void) => void;
	'game:dash': (callback?: (ok: boolean) => void) => void;
}

export interface ServerToClientEvents {
	// * Player
	'player:id': (id: string) => void;
	// * Room
	'room:all': (rooms: Room[]) => void;
	'room:created': (room: Room) => void;
	'room:playerJoined': (player: Player, room: Room) => void;
	'room:playerLeft': (player: Player, room: Room) => void;
	'room:deleted': (roomId: string) => void;
	'room:current': (roomId: string | null) => void;
	'room:gameCreated': () => void;
	'room:playerReady': (player: Player, ready: boolean) => void;
	'room:playerStatus': (player: Player, loggedIn: boolean) => void;
	// * Matchmaking
	'matchmaking:found': (room: Room) => void;
	// * Game
	'game:startIn': (seconds: number) => void;
	'game:start': () => void;
	'game:tick': (tick: number) => void;
	'game:over': (winner: number) => void;
	'game:piece': (piece: GamePiece) => void;
	'game:board': (board: GameBoard) => void;
}

interface SocketData {
	player: import('$server/lib/Player').default;
}

export type TypedSocket = Socket<
	ClientToServerEvents,
	ServerToClientEvents,
	DefaultEventsMap,
	NonNullable<SocketData>
>;

export type SocketServer = Server<
	ClientToServerEvents,
	ServerToClientEvents,
	DefaultEventsMap,
	NonNullable<SocketData>
>;
