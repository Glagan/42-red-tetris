// import { nanoid } from 'nanoid';
// import { io, Socket } from 'socket.io-client';
// import { get } from 'svelte/store';
// import { browser } from '$app/env';
// import type { ServerToClientEvents, ClientToServerEvents } from '../socket';
// import rooms from '$client/stores/rooms';
// import currentRoom from './stores/currentRoom';
// import UsernameStore from './stores/username';

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
// 		UsernameStore.set(username);
// 	}
// 	UsernameStore.set(username);

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
// 				socket.emit('room:leave');
// 				socket.emit('room:get', room.id, (room) => {
// 					console.log('room (should be null)', room);
// 					console.log('room', room);
// 				});
// 				socket.emit('room:ready', (success) => {
// 					console.log('success?', success);
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

// /// @ts-expect-error It is defined when used in browsert moe
// export default socket;
