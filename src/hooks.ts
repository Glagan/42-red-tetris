import type { Handle } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import useRoomAPI from '$server/events/room';
import RoomManager from '$server/RoomManager';
import PlayerManager from '$server/PlayerManager';
import { ioServer } from '$server/lib/SocketIO';
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

// * Auth middleware to check user tokens
if (ioServer) {
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
				const player = PlayerManager.add(socket.id, token, socket.handshake.auth.username);
				player.socket = socket;
				socket.data.player = player;
			}

			next();
		});
	}

	ioServer.removeAllListeners('connection'); // Debug
	ioServer.on('connection', (socket) => {
		console.log(`[${socket.id}]  on:connection`);

		socket.on('disconnect', () => {
			console.log(`[${socket.id}]  on:disconnect`);
			if (socket.data.player) {
				RoomManager.removePlayerFromMatchmaking(socket.data.player.id);
				socket.data.player.socket = undefined;
			}
			PlayerManager.removeSocket(socket.id);
		});

		useUserAPI(socket);
		useRoomAPI(socket);
		useMatchmakingAPI(socket);
		useGameAPI(socket);

		socket.emit('room:all', RoomManager.all());
		if (socket.data.player?.room) {
			socket.join(`room:${socket.data.player.room.id}`);
			socket.emit('room:current', socket.data.player.room.id);
		}
	});
}

// Add debug headers and check performances
export const handle: Handle = async ({ event, resolve }) => {
	// Add debug
	event.locals.id = nanoid();
	const start = performance.now();
	console.log(`[${event.locals.id}] ${event.request.method} ${event.url}`);
	const response = await resolve(event);
	console.log(
		`[${event.locals.id}] ${response.status} ${Math.round((performance.now() - start) * 10) / 10}ms`
	);
	response.headers.append('Request-Id', event.locals.id);
	return response;
};
