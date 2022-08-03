import type { Handle } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import InvalidRequestError from '$server/lib/Errors/InvalidRequestError';
import ValidationError from '$server/lib/Errors/ValidationError';
import useRoomAPI from '$server/events/room';
import rooms from '$server/RoomManager';
import PlayerManager from '$server/PlayerManager';
import { ioServer } from '$server/lib/SocketIO';

// * Auth middleware to check user tokens
let bindMiddleware = false;
if (!bindMiddleware) {
	bindMiddleware = true;
	ioServer.use((socket, next) => {
		const token = socket.handshake.auth.token;
		if (!token) {
			next(Error('Missing token in handshake'));
		}

		if (PlayerManager.exists(socket.id)) {
			console.log('connected user');
			PlayerManager.refreshPlayer(token);
		} else {
			PlayerManager.addPlayer(socket.id, token, socket.handshake.auth.username);
		}

		console.log('users', PlayerManager.players, PlayerManager.playersBySocket);
		next();
	});
}

ioServer.removeAllListeners('connection'); // Debug
ioServer.on('connection', (socket) => {
	console.log(`[${socket.id}]  on:connection`);

	useRoomAPI(socket);

	socket.on('disconnect', () => {
		console.log(`[${socket.id}]  on:disconnect`);
		PlayerManager.removeSocket(socket.id);
	});
	socket.emit('room:all', rooms.all());
});

// Mark the function async to catch both promises and non-promise exceptions
export const handle: Handle = async ({ event, resolve }) => {
	// Add debug
	event.locals.id = nanoid();
	const start = performance.now();
	console.log(`[${event.locals.id}] ${event.request.method} ${event.url}`);

	// Resolve the route with a try catch to handle validation
	try {
		const response = await resolve(event);
		console.log(
			`[${event.locals.id}] ${response.status} ${
				Math.round((performance.now() - start) * 10) / 10
			}ms`
		);
		response.headers.append('Request-Id', event.locals.id);
		return response;
	} catch (error) {
		if (error instanceof ValidationError) {
			return new Response(
				JSON.stringify({
					message: 'Bad request',
					error: error.reasons
				}),
				{
					status: 400,
					headers: {
						'Request-Id': event.locals.id,
						'content-type': 'application/json'
					}
				}
			);
		} else if (error instanceof InvalidRequestError) {
			return new Response(
				JSON.stringify({
					message: error.message
				}),
				{
					headers: {
						'Request-Id': event.locals.id,
						'content-type': 'application/json'
					}
				}
			);
		}
		throw error;
	}
};

// export const handleError: HandleError = ({ error, event }) => {};
