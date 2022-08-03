import Room from '$server/lib/Room';
import { validateBody } from '$server/lib/Validator';
import isValidName from '$server/lib/Validators/Name';
import { objectOf } from '@altostra/type-validations';
import type { Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../../socket';
import isValidID from '$server/lib/Validators/ID';
import PlayerManager from '$server/PlayerManager';
import RoomManager from '$server/RoomManager';

export type CreateRoomRequest = {
	name: string;
};

export type GetRoomRequest = {
	id: string;
};

export default function useRoomAPI(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
	socket.on('room:create', (name, callback) => {
		console.log(`[${socket.id}]  room:create`, name);

		validateBody(
			{ name },
			objectOf<CreateRoomRequest>({
				name: isValidName
			})
		);

		const roomName = name.trim();
		const room = new Room(roomName);
		RoomManager.addRoom(room);
		const player = PlayerManager.getPlayer(socket.id);
		if (player) {
			player.joinRoom(room);
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
		}
		// global.io.broadcast('room:created', room);
	});

	socket.on('room:get', (roomId, callback) => {
		console.log(`[${socket.id}]  room:get`, roomId);

		validateBody(
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
			return callback(undefined);
		}
	});

	socket.on('room:join', (roomId) => {
		console.log(`[${socket.id}]  room:join`);

		const player = PlayerManager.getPlayer(socket.id);
		const room = RoomManager.getRoom(roomId);
		if (player && room && !room.isFull()) {
			player.joinRoom(room);
		}
	});

	socket.on('room:leave', () => {
		console.log(`[${socket.id}]  room:leave`);

		const player = PlayerManager.getPlayer(socket.id);
		if (player) {
			const previousRoom = player.leaveCurrentRoom();
			if (previousRoom && previousRoom.isEmpty()) {
				RoomManager.removeRoom(previousRoom.id);
				// global.io.broadcast('room:deleted', roomId);
			}
		}
	});
}
