import { validatePayload } from '$server/lib/Validator';
import isValidName from '$server/lib/Validators/Name';
import { objectOf } from '@altostra/type-validations';
import type { ClientToServerEvents, TypedSocket } from '../../socket';
import isValidID from '$server/lib/Validators/ID';
import RoomManager from '$server/RoomManager';
import isValidQuery from '$server/lib/Validators/Query';
import type Room from '$server/lib/Room';

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

		if (
			socket.data.player &&
			!socket.data.player.room &&
			!RoomManager.playerIsInMatchmaking(socket.data.player.id)
		) {
			const room = RoomManager.createRoom(name.trim(), [socket.data.player]);
			if (callback) {
				if (room) {
					callback(room.toClient());
				} else {
					callback(null, { message: 'A room with this name already exists' });
				}
			}
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
			return callback(room.toClient());
		}

		if (callback) {
			return callback(null);
		}
	};
	socket.on('room:get', roomGet);

	// *

	const roomJoin: ClientToServerEvents['room:join'] = (roomId, callback) => {
		/* c8 ignore next 7 */
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
			if (callback) {
				callback(room.toClient());
			}
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
		/* c8 ignore next 7 */
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
			if (previousRoom.isEmpty()) {
				RoomManager.removeRoom(previousRoom.id);
			}
			if (callback) {
				callback(previousRoom.isEmpty());
			}
		} else if (callback) {
			callback(false, { message: "You aren't in a room" });
		}
	};
	socket.on('room:leave', roomLeave);

	// *

	const roomReady: ClientToServerEvents['room:ready'] = (callback) => {
		/* c8 ignore next 7 */
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
			}
			if (callback) {
				callback(ready);
			}
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
				callback(RoomManager.all().slice(-50));
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

		const results: Room[] = [];
		for (const room of RoomManager.rooms.reverse()) {
			if (room.matchAny(query)) {
				results.push(room);
				if (results.length >= 50) {
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
		/* c8 ignore next 7 */
		if (!socket.data.player) {
			if (callback) {
				callback(false, { message: 'You need to be logged in to manage a room' });
			}
			return;
		}

		const room = socket.data.player.room;
		if (!room || room.players.length < 2) {
			if (callback) {
				callback(false, { message: 'You need to be in a room with 2 players to manage it' });
			}
			return;
		}

		if (room.players[0].id != socket.data.player.id) {
			if (callback) {
				callback(false, { message: 'Only the owner of a room can manage it' });
			}
			return;
		}

		room.kickSecondPlayer();
		if (callback) {
			callback(true);
		}
	};
	socket.on('room:kick', roomKick);
}
