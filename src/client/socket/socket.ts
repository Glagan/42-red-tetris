import { nanoid } from 'nanoid';
import { io, Socket } from 'socket.io-client';
import { browser } from '$app/env';
import type { ServerToClientEvents, ClientToServerEvents } from '../../socket';
import UsernameStore from '../stores/username';
import SocketStore from '../stores/socket';
import IdStore from '../stores/id';
import NotificationStore from '../stores/notification';
import { v4 as uuidv4 } from 'uuid';
import username_generator from '../../utils/username.generator';
import type Player from '../lib/Player';
import type Room from '../lib/Room';
import CurrentRoomStore from '../stores/currentRoom';
import OpponentReadyStore from '../stores/opponentReady';
import PiecesStore from '../stores/pieces';
import GameStartStore from '../stores/gameStart';
import BoardsStore from '../stores/boards';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import type GameBoard from '../lib/GameBoard';
import type GamePiece from '../lib/GamePiece';

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

	socket.on('game:startIn', (seconds: number) => {
		GameStartStore.startIn(seconds);
	});

	socket.on('game:start', () => {
		GameStartStore.start();
		goto('/game');
	});

	socket.on('game:board', (board: GameBoard) => {
		BoardsStore.refreshBoard(board);
	});

	socket.on('room:playerLeft', (player: Player, room: Room) => {
		if (room.id == get(CurrentRoomStore)?.id && player.id != get(IdStore)) {
			NotificationStore.push({ id: uuidv4(), message: 'player left', error: false });
			CurrentRoomStore.set(room);
			OpponentReadyStore.set(false);
		}
	});

	socket.on('room:playerJoined', (player: Player, room: Room) => {
		if (room.id == get(CurrentRoomStore)?.id) {
			NotificationStore.push({ id: uuidv4(), message: 'player joined', error: false });
			CurrentRoomStore.add_player(player);
		}
	});

	socket.on('room:playerReady', (player: Player, ready: boolean) => {
		if (
			player.id != get(IdStore) &&
			(get(CurrentRoomStore)?.players[0].id === player.id ||
				get(CurrentRoomStore)?.players[1].id === player.id)
		) {
			OpponentReadyStore.set(ready);
		}
	});

	socket.on('game:piece', (piece: GamePiece) => {
		console.log('-------------------------------------- on game:piece 0');
		console.log('on update la piece:', piece.player);
		console.log(piece.matrix);
		PiecesStore.updatePiece(piece);
	});

	socket.on('player:id', (id: string) => {
		IdStore.set(id);
		NotificationStore.push({ id: uuidv4(), message: 'id: ' + id, error: false });
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
