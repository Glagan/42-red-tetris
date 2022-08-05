import type { Handle } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import useRoomAPI from '$server/events/room';
import rooms from '$server/RoomManager';
import PlayerManager from '$server/PlayerManager';
import { ioServer } from '$server/lib/SocketIO';
import useGameAPI from '$server/events/game';
import useUserAPI from '$server/events/user';

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

			const player = PlayerManager.get(token);
			if (player) {
				player.refresh();
				socket.player = player;
			} else {
				const player = PlayerManager.add(socket.id, token, socket.handshake.auth.username);
				socket.player = player;
			}

			next();
		});
	}

	ioServer.removeAllListeners('connection'); // Debug
	ioServer.on('connection', (socket) => {
		console.log(`[${socket.id}]  on:connection`);

		socket.on('disconnect', () => {
			console.log(`[${socket.id}]  on:disconnect`);
			PlayerManager.removeSocket(socket.id);
		});

		useUserAPI(socket);
		useRoomAPI(socket);
		useGameAPI(socket);

		socket.emit('room:all', rooms.all());
		if (socket.player?.room) {
			socket.rooms.add(`room:${socket.player.room.id}`);
			socket.emit('room:current', socket.player.room.id);
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
