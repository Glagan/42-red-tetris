import useRoomAPI from '$server/events/room';
import RoomManager from '$server/RoomManager';
import PlayerManager from '$server/PlayerManager';
import WebSocket from '$server/lib/SocketIO';
import useGameAPI from '$server/events/game';
import useUserAPI from '$server/events/user';
import { validatePayload } from '$server/lib/Validator';
import { objectOf } from '@altostra/type-validations';
import isValidID from '$server/lib/Validators/ID';
import isValidName from '$server/lib/Validators/Name';
import useMatchmakingAPI from '$server/events/matchmaking';

type AuthPayload = {
	token: string;
	username?: string;
};

export default function SetupSocketServer() {
	// * Auth middleware to check user tokens
	WebSocket.server.use((socket, next) => {
		const token = socket.handshake.auth.token;
		if (!token) {
			next(Error('Missing token in handshake'));
		}

		if (
			!validatePayload(
				{ token, username: socket.handshake.auth.username },
				objectOf<AuthPayload>({
					token: isValidID,
					username: isValidName
				})
			)
		) {
			next(Error('Invalid handshake payload'));
		}

		const player = PlayerManager.get(token);
		if (player) {
			player.socket = socket;
			socket.data.player = player;
		} else {
			const player = PlayerManager.add(token, socket.handshake.auth.username);
			player.socket = socket;
			socket.data.player = player;
		}

		next();
	});

	WebSocket.server.removeAllListeners('connection'); // Debug
	WebSocket.server.on('connection', (socket) => {
		console.log(`[${socket.id}]  on:connection`);

		socket.onAny((event) => {
			console.log(`[${socket.id}]  ${event}`);
		});

		socket.on('disconnect', () => {
			console.log(`[${socket.id}]  on:disconnect`);
			if (socket.data.player?.room) {
				socket.data.player.room.unreadyPlayer(socket.data.player.id);
				socket
					.to(`room:${socket.data.player.room.id}`)
					.emit('room:playerStatus', socket.data.player.toClient(), false);
			}
			if (socket.data.player) {
				RoomManager.removePlayerFromMatchmaking(socket.data.player.id);
				socket.data.player.socket = undefined;
			}
		});

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		socket.emit('player:id', socket.data.player!.id);
		if (socket.data.player?.room) {
			const room = socket.data.player.room;
			socket.emit('room:current', room.id);
			if (room.isPlaying() && room.game) {
				const playersIndex = Object.entries(room.playersIndex);
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const playerOneId = playersIndex.find((playersIndex) => playersIndex[1] == 0)![0];
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const playerTwoId = playersIndex.find((playersIndex) => playersIndex[1] == 1)![0];
				socket.emit('game:current', {
					playerOne: {
						id: playerOneId,
						...room.game.globalState(0)
					},
					playerTwo: {
						id: playerTwoId,
						...room.game.globalState(1)
					}
				});
			} else {
				socket.emit('game:current', null);
			}
			socket.join(`room:${room.id}`);
			socket.to(`room:${room.id}`).emit('room:playerStatus', socket.data.player.toClient(), true);
		} else {
			socket.emit('room:current', null);
			socket.emit('game:current', null);
		}

		useUserAPI(socket);
		useRoomAPI(socket);
		useMatchmakingAPI(socket);
		useGameAPI(socket);
	});
}
