import { nanoid } from 'nanoid';
import { io, Socket } from 'socket.io-client';
import { get } from 'svelte/store';
import { browser } from '$app/env';
import type { ServerToClientEvents, ClientToServerEvents } from '../socket';
import rooms from '$client/stores/rooms';
import currentRoom from './stores/currentRoom';
import UsernameStore from './stores/username';
import SocketStore from './stores/socket';
import NotificationStore from './stores/notification';
import { v4 as uuidv4 } from 'uuid';
import username_generator from '../utils/username.generator';

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

if (browser) {
	SocketStore.set('');
	let token = localStorage.getItem('token');
	if (!token) {
		token = nanoid();
		localStorage.setItem('token', token);
	}
	let username = localStorage.getItem('username');
	if (username == null) {
		username = username_generator();
		localStorage.setItem('username', username);
		UsernameStore.set(username);
	}
	UsernameStore.set(username);

	socket = io({
		auth: { token, username },
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
		reconnectionAttempts: 5
	});

	socket.on('connect', () => {
		SocketStore.set('connect');
		NotificationStore.push({ id: uuidv4(), message: 'server: connected', error: false });
	});

	socket.on('disconnect', () => {
		SocketStore.set('disconnect');
		NotificationStore.push({ id: uuidv4(), message: 'server: disconnected', error: true });
	});

	socket.io.on('error', () => {
		SocketStore.set('error');
		NotificationStore.push({ id: uuidv4(), message: 'server: error', error: true });
	});

	socket.io.on('reconnect', () => {
		SocketStore.set('reconnect');
		NotificationStore.push({ id: uuidv4(), message: 'server: reconnected', error: false });
	});

	socket.io.on('reconnect_attempt', () => {
		SocketStore.set('reconnect_attempt');
		NotificationStore.push({ id: uuidv4(), message: 'server: reconnection attempt', error: false });
	});

	socket.io.on('reconnect_error', () => {
		SocketStore.set('reconnect_error');
		NotificationStore.push({ id: uuidv4(), message: 'server: reconnection error', error: true });
	});

	socket.io.on('reconnect_failed', () => {
		SocketStore.set('reconnect_failed');
		NotificationStore.push({ id: uuidv4(), message: 'server: reconnection failed', error: true });
	});

	// socket.on('room:all', (serverRooms) => {
	// 	rooms.set(serverRooms);
	// });

	// socket.on('room:current', (currentRoomId) => {
	// 	if (currentRoomId) {
	// 		currentRoom.set(currentRoomId);
	// 	}
	// });

	// socket.on('room:created', (room) => {
	// 	const roomList = get(rooms);
	// 	roomList.push(room);
	// 	rooms.set(roomList);
	// });

	// socket.on('room:deleted', (roomId) => {
	// 	const currenRooms = get(rooms);
	// 	const index = currenRooms.findIndex((room) => room.id == roomId);
	// 	if (index >= 0) {
	// 		currenRooms.splice(index, 1);
	// 		rooms.set(currenRooms);
	// 	}
	// });
}

// let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

// if (browser) {
// 	let token = localStorage.getItem('token');
// 	if (!token) {
// 		token = nanoid();
// 		localStorage.setItem('token', token);
// 	}
// 	let username = localStorage.getItem('username');
// 	if (username == null) {
// 		username = 'Player' + Math.random().toString();
// 		localStorage.setItem('username', username);
// 		UsernameStore.set(username)
// 	}
// 	UsernameStore.set(username)

// 	socket = io({
// 		auth: { token, username }
// 	});

// 	socket.on('connect', () => {
// 		socket.emit('room:create', 'my room', (room) => {
// 			if ('message' in room) {
// 				console.log(room.message);
// 			} else {
// 				currentRoom.set(room.id);
// 				console.log('room', room);
// 				// socket.emit('room:leave');
// 				socket.emit('room:get', room.id, (room) => {
// 					// console.log('room (should be null)', room);
// 					console.log('room', room);
// 				});
// 			}
// 		});

// 		socket.emit('game:test');
// 	});

// 	socket.on('room:all', (serverRooms) => {
// 		rooms.set(serverRooms);
// 	});

// 	socket.on('room:current', (currentRoomId) => {
// 		if (currentRoomId) {
// 			currentRoom.set(currentRoomId);
// 		}
// 	});

// 	socket.on('room:created', (room) => {
// 		const roomList = get(rooms);
// 		roomList.push(room);
// 		rooms.set(roomList);
// 	});

// 	socket.on('room:deleted', (roomId) => {
// 		const currenRooms = get(rooms);
// 		const index = currenRooms.findIndex((room) => room.id == roomId);
// 		if (index >= 0) {
// 			currenRooms.splice(index, 1);
// 			rooms.set(currenRooms);
// 		}
// 	});
// }

/// @ts-expect-error It is defined when used in browsert moe
export default socket;
