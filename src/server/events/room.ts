import Room from '$server/lib/Room';
import { validatePayload } from '$server/lib/Validator';
import isValidName from '$server/lib/Validators/Name';
import { objectOf } from '@altostra/type-validations';
import type { Socket } from 'socket.io';
import type { BasicError, ClientToServerEvents, ServerToClientEvents } from '../../socket';
import isValidID from '$server/lib/Validators/ID';
import RoomManager from '$server/RoomManager';
import { ioServer } from '$server/lib/SocketIO';
import isValidQuery from '$server/lib/Validators/Query';

export type CreateRoomPayload = {
	name: string;
};

export type GetRoomPayload = {
	id: string;
};

export type SearchPayload = {
	query: string;
};

export default function useRoomAPI(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
	socket.on('room:create', (name, callback) => {
		console.log(`[${socket.id}]  room:create`, name);

		validatePayload(
			{ name },
			objectOf<CreateRoomPayload>({
				name: isValidName
			})
		);

		const roomName = name.trim();
		if (!socket.data.player.room) {
			const room = new Room(roomName);
			socket.data.player.joinRoom(room);
			socket.join(`room:${room.id}`);
			RoomManager.addRoom(room);
			if (callback) {
				callback({
					id: room.id,
					name: room.name,
					players: room.players.map((player) => ({
						id: player.id,
						name: player.name
					}))
				});
			}
			ioServer.emit('room:created', room.toClient());
		} else if (callback) {
			callback({ message: 'You already are in a room' });
		}
	});

	socket.on('room:get', (roomId, callback) => {
		console.log(`[${socket.id}]  room:get`, roomId);

		validatePayload(
			{ id: roomId },
			objectOf<GetRoomPayload>({
				id: isValidID
			})
		);

		const room = RoomManager.getRoom(roomId);
		if (room && callback) {
			return callback({
				id: room.id,
				name: room.name,
				players: room.players.map((player) => ({
					id: player.id,
					name: player.name
				}))
			});
		}

		if (callback) {
			return callback(null);
		}
	});

	socket.on('room:join', (roomId, callback) => {
		console.log(`[${socket.id}]  room:join`);

		if (socket.data.player.room) {
			if (callback) {
				callback({ message: 'You already are in a room' });
			}
			return;
		}

		const room = RoomManager.getRoom(roomId);
		if (room && !room.isFull() && !room.isPlaying()) {
			socket.data.player.joinRoom(room);
			socket.join(`room:${roomId}`);
			if (callback) {
				callback(room.toClient());
			}
		} else if (callback) {
			callback({ message: 'The room is full or already in a game' });
		}
	});

	socket.on('room:leave', (callback: (success: boolean | BasicError) => void) => {
		console.log(`[${socket.id}]  room:leave`);

		if (socket.data.player.room?.isPlaying()) {
			if (callback) {
				callback({ message: "You can't leave a room while a game is playing" });
			}
			return;
		}

		const previousRoom = socket.data.player.leaveCurrentRoom();
		if (previousRoom) {
			socket.leave(`room:${previousRoom.id}`);
		}
		if (previousRoom) {
			if (previousRoom.isEmpty()) {
				RoomManager.removeRoom(previousRoom.id);
				if (callback) {
					callback(true);
				}
				ioServer.emit('room:deleted', previousRoom.id);
			} else {
				if (callback) {
					callback(false);
				}
				ioServer.emit('room:playerLeft', socket.data.player.toClient(), previousRoom.toClient());
			}
		}
	});

	socket.on('room:ready', (callback) => {
		console.log(`[${socket.id}]  room:leave`);

		if (socket.data.player.room?.game && socket.data.player.room.winner < 0) {
			callback({ message: "A game is already in progress, you can't ready up" });
		}
		if (socket.data.player.room) {
			const room = socket.data.player.room;
			room.markPlayerAsReady(socket.data.player.id);
			if (room.allPlayersReady()) {
				room.createGame();
				ioServer.to(`room:${room.id}`).emit('room:gameCreated');
				if (callback) {
					callback(true);
				}
			}
		} else if (callback) {
			callback({ message: 'You are not currently in a room' });
		}
	});

	socket.on('room:search', (query, callback) => {
		console.log(`[${socket.id}]  room:search`, query);

		validatePayload(
			{ query },
			objectOf<SearchPayload>({
				query: isValidQuery
			})
		);

		const parts = query.trim().split(' ');
		const results: Room[] = [];
		for (const room of RoomManager.rooms) {
			for (const part of parts) {
				if (
					room.name.indexOf(part) >= 0 ||
					room.id == part ||
					room.players.findIndex((player) => player.id == part || player.name.indexOf(part) >= 0)
				) {
					results.push(room);
					break;
				}
			}
		}

		if (callback) {
			callback(results.map((room) => room.toClient()));
		}
	});
}
