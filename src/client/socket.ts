import { nanoid } from 'nanoid';
import { io, Socket } from 'socket.io-client';
import { browser } from '$app/env';
import type { ServerToClientEvents, ClientToServerEvents } from '$client/types';

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
if (browser) {
	let token = localStorage.getItem('token');
	if (!token) {
		token = nanoid();
		localStorage.setItem('token', token);
	}

	socket = io({
		auth: { token }
	});

	socket.on('connect', () => {
		socket.emit('room:create', 'my room');
	});

	socket.on('room:created', (room) => {
		console.log('room', room);
	});
}

/// @ts-expect-error It is defined when used in browsert moe
export default socket;
