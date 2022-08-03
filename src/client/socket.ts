import { nanoid } from 'nanoid';
import { io, Socket } from 'socket.io-client';
import { browser } from '$app/env';
import type { ServerToClientEvents, ClientToServerEvents } from '../socket';

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
if (browser) {
	let token = localStorage.getItem('token');
	if (!token) {
		token = nanoid();
		localStorage.setItem('token', token);
	}
	let username = localStorage.getItem('username');
	if (!username) {
		username = 'Player';
		localStorage.setItem('username', username);
	}

	socket = io({
		auth: { token, username }
	});

	socket.on('connect', () => {
		socket.emit('room:create', 'my room', (room) => {
			console.log('room', room);
		});
	});

	socket.on('room:created', (room) => {
		console.log('room', room);
	});

	socket.on('room:all', (rooms) => {
		console.log('rooms', rooms);
	});
}

/// @ts-expect-error It is defined when used in browsert moe
export default socket;
