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

export type CreateRoomRequest = {
	name: string;
};

export type GetRoomRequest = {
	id: string;
};

export default function useRoomAPI(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
	socket.on('room:create', (name, callback) => {
		console.log(`[${socket.id}]  room:create`, name);
		const token = socket.handshake.auth.token;

		validatePayload(
			{ name },
			objectOf<CreateRoomRequest>({
				name: isValidName
			})
		);

		const roomName = name.trim();
		const player = PlayerManager.getPlayer(token);
		if (player && !player.room) {
			const room = new Room(roomName);
			player.joinRoom(room);
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
			objectOf<GetRoomRequest>({
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
			if (previousRoom && previousRoom.isEmpty()) {
				RoomManager.removeRoom(previousRoom.id);
				ioServer.emit('room:deleted', previousRoom.id);
			} else if (previousRoom) {
				ioServer.emit('room:playerLeft', player.toClient(), previousRoom.toClient());
			}
		}
	});
}
