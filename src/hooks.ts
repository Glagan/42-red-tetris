import type { Handle } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { DateTime } from 'luxon';
import InvalidRequestError from '$server/lib/Errors/InvalidRequestError';
import ValidationError from '$server/lib/Errors/ValidationError';
import useRoomAPI from '$server/events/room';
import { socketUserReferences, socketUsers } from '$server/users';
import Player from '$server/lib/Player';
import type { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from './server/types';

const io = (global as unknown as { io: Server<ClientToServerEvents, ServerToClientEvents> }).io;

// * Auth middleware to check user tokens
io.use((socket, next) => {
	const token = socket.handshake.auth.token;
	if (!token) {
		next(Error('Missing token in handshake'));
	}

	if (socketUserReferences[socket.id]) {
		console.log('connected user');
		const player = socketUsers[token];
		if (player) {
			socketUsers[token].lastUpdate = DateTime.now();
		}
	} else {
		socketUserReferences[socket.id] = token;
		socketUsers[token] = {
			player: new Player(token, 'Player'),
			lastUpdate: DateTime.now()
		};
	}

	console.log('users', socketUserReferences, socketUsers);
	next();
});

io.on('connection', (socket) => {
	console.log(`[${socket.id}]  on:connection`);
	useRoomAPI(socket);
	socket.on('disconnect', () => {
		console.log(`[${socket.id}]  on:disconnect`);
		delete socketUserReferences[socket.id];
	});
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
