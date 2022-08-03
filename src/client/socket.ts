import { nanoid } from 'nanoid';
import { io, Socket } from 'socket.io-client';
import { browser } from '$app/env';
import type { ServerToClientEvents, ClientToServerEvents } from '../socket';
import rooms from '$client/stores/rooms';
import { get } from 'svelte/store';

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
			// socket.emit('room:leave');
			socket.emit('room:get', room.id, (room) => {
				// console.log('room (should be null)', room);
				console.log('room', room);
			});
		});
	});

	socket.on('room:all', (serverRooms) => {
		rooms.set(serverRooms);
	});

	socket.on('room:created', (room) => {
		const roomList = get(rooms);
		roomList.push(room);
		rooms.set(roomList);
	});

	socket.on('room:deleted', (roomId) => {
		const currenRooms = get(rooms);
		const index = currenRooms.findIndex((room) => room.id == roomId);
		if (index >= 0) {
			currenRooms.splice(index, 1);
			rooms.set(currenRooms);
		}
	});
}

/// @ts-expect-error It is defined when used in browsert moe
export default socket;
