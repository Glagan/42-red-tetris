import { nanoid } from 'nanoid';
import { io, Socket } from 'socket.io-client';
import { get } from 'svelte/store';
import { browser } from '$app/env';
import type { ServerToClientEvents, ClientToServerEvents } from '../socket';
import rooms from '$client/stores/rooms';
import currentRoom from './stores/currentRoom';
import UsernameStore from './stores/username';
import { getRandomInt } from '$utils/random';

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

if (browser) {
	let token = localStorage.getItem('token');
	if (!token) {
		token = nanoid();
		localStorage.setItem('token', token);
	}
	let username = localStorage.getItem('username');
	if (username == null) {
		username = `Player#${getRandomInt(1000, 9999)}`;
		localStorage.setItem('username', username);
		UsernameStore.set(username);
	}
	UsernameStore.set(username);

	socket = io({
		auth: { token, username }
	});

	let gameInterval = 0;
	socket.on('connect', () => {
		socket.emit('room:create', 'my room', (room) => {
			if ('message' in room) {
				console.log(room.message);
			} else {
				currentRoom.set(room.id);
				console.log('room', room);
				// socket.emit('room:leave');
				socket.emit('room:get', room.id, (room) => {
					// console.log('room (should be null)', room);
					console.log('room', room);
				});
				socket.emit('room:ready', (success) => {
					console.log('success?', success);
				});
			}
		});

		// socket.emit('game:test');
	});

	socket.on('room:all', (serverRooms) => {
		rooms.set(serverRooms);
	});

	socket.on('room:current', (currentRoomId) => {
		if (currentRoomId) {
			currentRoom.set(currentRoomId);
		}
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

	socket.on('room:gameCreated', () => {
		console.log('game created');
	});

	socket.on('game:start', () => {
		console.log('start !!');
		gameInterval = setInterval(() => {
			const actions: (keyof ClientToServerEvents)[] = [
				'game:rotate:clockwise',
				'game:rotate:counter-clockwise',
				'game:move:left',
				'game:move:right',
				'game:dash'
			];
			const action = getRandomInt(0, actions.length);
			socket.emit(actions[action], (ok: boolean) => {
				console.log(actions[action], ok);
			});
		}, 200) as unknown as number;
	});

	socket.on('game:tick', (tick) => {
		console.log('game:tick', tick);
	});

	socket.on('game:over', (winner) => {
		console.log('game:over', winner);
		clearInterval(gameInterval);
	});

	socket.on('game:startIn', (seconds) => {
		console.log('game starts in', seconds, 'seconds');
	});

	socket.on('game:piece', (piece) => {
		console.log('received game piece', piece);
	});

	socket.on('game:board', (board) => {
		console.log('received game board', board);
	});
}

/// @ts-expect-error It is defined when used in browsert moe
export default socket;
