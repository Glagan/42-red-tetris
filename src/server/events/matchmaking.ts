import Room from '$server/lib/Room';
import { ioServer } from '$server/lib/SocketIO';
import RoomManager from '$server/RoomManager';
import { getRandomInt } from '$utils/random';
import type { ClientToServerEvents, TypedSocket } from '../../socket';

export default function useMatchmakingAPI(socket: TypedSocket) {
	const matchmakingJoin: ClientToServerEvents['matchmaking:join'] = (callback) => {
		if (
			socket.data.player &&
			!socket.data.player.room &&
			!RoomManager.playerIsInMatchmaking(socket.data.player.id)
		) {
			const opponent = RoomManager.findOpponent(socket.data.player.id);
			if (opponent && opponent.socket) {
				const room = new Room(`Matchmaking#${getRandomInt(1000, 9999)}`);
				opponent.joinRoom(room);
				opponent.socket.join(`room:${room.id}`);
				RoomManager.removePlayerFromMatchmaking(opponent.id);
				socket.data.player.joinRoom(room);
				socket.join(`room:${room.id}`);
				ioServer.emit('room:created', room.toClient());
			} else {
				RoomManager.addPlayerToMatchmaking(socket.data.player);
				if (callback) {
					callback(true);
				}
			}
		} else if (callback) {
			callback(false, { message: 'You already are in a room or in queue' });
		}
	};
	socket.on('matchmaking:join', matchmakingJoin);

	// *

	const matchmakingLeave: ClientToServerEvents['matchmaking:leave'] = (callback) => {
		if (socket.data.player) {
			RoomManager.removePlayerFromMatchmaking(socket.data.player.id);
			if (callback) {
				callback(true);
			}
		} else if (callback) {
			callback(false, { message: 'You need to be logged in to leave Matchmaking' });
		}
	};
	socket.on('matchmaking:leave', matchmakingLeave);
}
