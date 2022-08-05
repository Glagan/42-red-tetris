import Room from '$server/lib/Room';
import { validatePayload } from '$server/lib/Validator';
import isValidName from '$server/lib/Validators/Name';
import { objectOf } from '@altostra/type-validations';
import type { Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../../socket';
import isValidID from '$server/lib/Validators/ID';
import PlayerManager from '$server/PlayerManager';
import RoomManager from '$server/RoomManager';
import { ioServer } from '$server/lib/SocketIO';

export type CreateRoomPayload = {
	name: string;
};

export type GetRoomPayload = {
	id: string;
};

export default function useRoomAPI(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
	socket.on('room:create', (name, callback) => {
		console.log(`[${socket.id}]  room:create`, name);
		const token = socket.handshake.auth.token;

		validatePayload(
			{ name },
			objectOf<CreateRoomPayload>({
				name: isValidName
			})
		);

		const roomName = name.trim();
		const player = PlayerManager.getPlayer(token);
		if (player && !player.room) {
			const room = new Room(roomName);
			player.joinRoom(room);
			socket.rooms.add(`room:${room.id}`);
			RoomManager.addRoom(room);
			if (callback) {
				callback({
					id: room.id,
					name: room.name,
					players: room.players.map((player) => ({
						id: player.id,
						name: player.name
					})),
					createdAt: room.createdAt.toString(),
					lastUpdate: room.lastUpdate.toString()
				});
			}
			ioServer.emit('room:created', room.toClient());
		} else if (player && callback) {
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
				})),
				createdAt: room.createdAt.toString(),
				lastUpdate: room.lastUpdate.toString()
			});
		}

		if (callback) {
			return callback(null);
		}
	});

	socket.on('room:join', (roomId, callback) => {
		console.log(`[${socket.id}]  room:join`);
		const token = socket.handshake.auth.token;

		const player = PlayerManager.getPlayer(token);
		if (player?.room) {
			if (callback) {
				callback({ message: 'You already are in a room' });
			}
			return;
		}
		const room = RoomManager.getRoom(roomId);
		if (player && room && !room.isFull()) {
			player.joinRoom(room);
			socket.rooms.add(`room:${roomId}`);
			if (callback) {
				callback(room.toClient());
			}
		} else if (callback) {
			callback({ message: 'The room is full' });
		}
	});

	socket.on('room:leave', () => {
		console.log(`[${socket.id}]  room:leave`);
		const token = socket.handshake.auth.token;

		const player = PlayerManager.getPlayer(token);
		if (player) {
			const previousRoom = player.leaveCurrentRoom();
			if (previousRoom) {
				socket.rooms.delete(`room:${previousRoom.id}`);
			}
			if (previousRoom && previousRoom.isEmpty()) {
				RoomManager.removeRoom(previousRoom.id);
				ioServer.emit('room:deleted', previousRoom.id);
			} else if (previousRoom) {
				ioServer.emit('room:playerLeft', player.toClient(), previousRoom.toClient());
			}
		}
	});

	socket.on('room:ready', (callback) => {
		console.log(`[${socket.id}]  room:leave`);
		const token = socket.handshake.auth.token;
		const player = PlayerManager.getPlayer(token);

		if (player) {
			if (player.room) {
				player.room.markPlayerAsReady(player.id);
				if (player.room.allPlayersReady()) {
					player.room.createGame();
					ioServer.to(`room:${player.room.id}`).emit('room:gameCreated');
				}
				setTimeout(() => {
					if (player.room) {
						player.room.startGame();
					}
				}, 5000);
			}
		} else if (callback) {
			callback({ message: 'No user found' });
		}
	});
}
