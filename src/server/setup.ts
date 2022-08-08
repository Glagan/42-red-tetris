import useRoomAPI from '$server/events/room';
import RoomManager from '$server/RoomManager';
import PlayerManager from '$server/PlayerManager';
import { ioServer, setIoServer } from '$server/lib/SocketIO';
import useGameAPI from '$server/events/game';
import useUserAPI from '$server/events/user';
import { validatePayload } from '$server/lib/Validator';
import { objectOf } from '@altostra/type-validations';
import isValidID from '$server/lib/Validators/ID';
import isValidName from '$server/lib/Validators/Name';
import useMatchmakingAPI from '$server/events/matchmaking';
import type { SocketServer } from '../socket';

type AuthPayload = {
	token: string;
	username?: string;
};

export default function SetupSocketServer(server?: SocketServer) {
	if (server) {
		setIoServer(server);
	}

	// * Auth middleware to check user tokens
	let bindMiddleware = false;
	if (!bindMiddleware) {
		bindMiddleware = true;
		ioServer.use((socket, next) => {
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
	}

	ioServer.removeAllListeners('connection'); // Debug
	ioServer.on('connection', (socket) => {
		console.log(`[${socket.id}]  on:connection`);

		socket.onAny((event) => {
			console.log(`[${socket.id}]  ${event}`);
		});

		socket.on('disconnect', () => {
			console.log(`[${socket.id}]  on:disconnect`);
			if (socket.data.player?.room) {
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
		socket.emit('room:all', RoomManager.all());
		if (socket.data.player?.room) {
			socket.join(`room:${socket.data.player.room.id}`);
			socket
				.to(`room:${socket.data.player.room.id}`)
				.emit('room:playerStatus', socket.data.player.toClient(), true);
			socket.emit('room:current', socket.data.player.room.id);
		}

		useUserAPI(socket);
		useRoomAPI(socket);
		useMatchmakingAPI(socket);
		useGameAPI(socket);
	});
}
