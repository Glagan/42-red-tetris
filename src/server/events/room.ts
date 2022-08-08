import Room from '$server/lib/Room';
import { validatePayload } from '$server/lib/Validator';
import isValidName from '$server/lib/Validators/Name';
import { objectOf } from '@altostra/type-validations';
import type { ClientToServerEvents, TypedSocket } from '../../socket';
import isValidID from '$server/lib/Validators/ID';
import RoomManager from '$server/RoomManager';
import WebSocket from '$server/lib/SocketIO';
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

export default function useRoomAPI(socket: TypedSocket) {
	const roomCreate: ClientToServerEvents['room:create'] = (name, callback) => {
		if (
			!validatePayload(
				{ name },
				objectOf<CreateRoomPayload>({
					name: isValidName
				})
			)
		) {
			if (callback) {
				callback(null, {
					message: 'Invalid Room name, must be non-empty and at most 20 characters'
				});
			}
			return;
		}

		const roomName = name.trim();
		if (
			socket.data.player &&
			!socket.data.player.room &&
			!RoomManager.playerIsInMatchmaking(socket.data.player.id)
		) {
			const room = new Room(roomName);
			socket.data.player.joinRoom(room);
			socket.join(`room:${room.id}`);
			RoomManager.addRoom(room);
			if (callback) {
				callback({
					id: room.id,
					name: room.name,
					players: room.players.map((player) => player.toClient())
				});
			}
			WebSocket.server.emit('room:created', room.toClient());
		} else if (callback) {
			callback(null, { message: 'You already are in a room or in matchmaking' });
		}
	};
	socket.on('room:create', roomCreate);

	// *

	const roomGet: ClientToServerEvents['room:get'] = (roomId, callback) => {
		if (
			!validatePayload(
				{ id: roomId },
				objectOf<GetRoomPayload>({
					id: isValidID
				})
			)
		) {
			if (callback) {
				callback(null, {
					message: 'Invalid Room ID, must be non-empty string of 21 characters'
				});
			}
			return;
		}

		const room = RoomManager.getRoom(roomId);
		if (room && callback) {
			return callback({
				id: room.id,
				name: room.name,
				players: room.players.map((player) => player.toClient())
			});
		}

		if (callback) {
			return callback(null);
		}
	};
	socket.on('room:get', roomGet);

	// *

	const roomJoin: ClientToServerEvents['room:join'] = (roomId, callback) => {
		if (!socket.data.player) {
			if (callback) {
				callback(null, { message: 'You need to be logged in to join a room' });
			}
			return;
		}

		if (socket.data.player.room || RoomManager.playerIsInMatchmaking(socket.data.player.id)) {
			if (callback) {
				callback(null, { message: 'You already are in a room or in Matchmaking' });
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
			WebSocket.server.emit('room:playerJoined', socket.data.player.toClient(), room.toClient());
		} else if (callback) {
			if (room) {
				callback(null, { message: 'The room is full or already in a game' });
			} else {
				callback(null, { message: "The room doesn't exists" });
			}
		}
	};
	socket.on('room:join', roomJoin);

	// *

	const roomLeave: ClientToServerEvents['room:leave'] = (callback) => {
		if (!socket.data.player) {
			if (callback) {
				callback(false, { message: 'You need to be logged in to join a room' });
			}
			return;
		}

		if (socket.data.player.room?.isPlaying()) {
			if (callback) {
				callback(false, { message: "You can't leave a room while a game is playing" });
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
				WebSocket.server.emit('room:deleted', previousRoom.id);
			} else {
				if (callback) {
					callback(false);
				}
				WebSocket.server.emit(
					'room:playerLeft',
					socket.data.player.toClient(),
					previousRoom.toClient()
				);
			}
		}
	};
	socket.on('room:leave', roomLeave);

	// *

	const roomReady: ClientToServerEvents['room:ready'] = (callback) => {
		if (!socket.data.player) {
			if (callback) {
				callback(false, { message: 'You need to be logged in to join a room' });
			}
			return;
		}

		if (socket.data.player.room) {
			if (socket.data.player.room?.game && socket.data.player.room.winner < 0) {
				if (callback) {
					callback(false, { message: "A game is already in progress, you can't ready up" });
				}
				return;
			}

			const room = socket.data.player.room;
			const ready = room.togglePlayerAsReady(socket.data.player.id);
			if (room.allPlayersReady()) {
				room.createGame();
				WebSocket.server.to(`room:${room.id}`).emit(
					'room:gameCreated',
					{
						current: room.currentPiece(0),
						next: room.nextPieces(0)
					},
					{
						current: room.currentPiece(1),
						next: room.nextPieces(1)
					}
				);
			}
			if (callback) {
				callback(ready);
			}
			WebSocket.server
				.to(`room:${room.id}`)
				.emit('room:playerReady', socket.data.player.toClient(), ready);
		} else if (callback) {
			callback(false, { message: 'You are not currently in a room' });
		}
	};
	socket.on('room:ready', roomReady);

	// *

	const roomSearch: ClientToServerEvents['room:search'] = (query, callback) => {
		query = query.trim();

		if (query == '') {
			if (callback) {
				callback(RoomManager.all());
			}
			return;
		}

		if (
			!validatePayload(
				{ query },
				objectOf<SearchPayload>({
					query: isValidQuery
				})
			)
		) {
			if (callback) {
				callback([], {
					message: 'Invalid query, must be a string of at most 50 characters'
				});
			}
			return;
		}

		const parts = query.trim().split(' ');
		const results: Room[] = [];
		for (const room of RoomManager.rooms) {
			for (const part of parts) {
				if (
					part != '' &&
					(room.name.indexOf(part) >= 0 ||
						room.id === part ||
						room.players.findIndex(
							(player) => player.id === part || player.name.indexOf(part) >= 0
						) >= 0)
				) {
					results.push(room);
					break;
				}
			}
		}

		if (callback) {
			callback(results.map((room) => room.toClient()));
		}
	};
	socket.on('room:search', roomSearch);

	// *

	const roomKick: ClientToServerEvents['room:kick'] = (callback) => {
		if (!socket.data.player) {
			if (callback) {
				callback(false, { message: 'You need to be logged in to manage a room' });
			}
			return;
		}

		const room = socket.data.player.room;
		if (!room || room.players.length < 1) {
			if (callback) {
				callback(false, { message: 'You need to be in a room to manage it' });
			}
			return;
		}

		if (room.players[0].id != socket.data.player.id) {
			if (callback) {
				callback(false, { message: 'Only the owner of a room can manage it' });
			}
			return;
		}

		const kicked = room.kickSecondPlayer();
		if (kicked) {
			if (kicked.socket) {
				kicked.socket.leave(`room:${room.id}`);
				kicked.socket.emit('room:kicked');
			}
			WebSocket.server.emit('room:playerLeft', kicked.toClient(), room.toClient());
		}
		WebSocket.server
			.to(`room:${room.id}`)
			.emit('room:playerReady', socket.data.player.toClient(), false);

		if (callback) {
			callback(true);
		}
	};
	socket.on('room:kick', roomKick);
}
