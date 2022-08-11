import { nanoid } from 'nanoid';
import { io, Socket } from 'socket.io-client';
import { browser } from '$app/env';
import type { ServerToClientEvents, ClientToServerEvents } from '../../socket';
import type { GameInitialState } from '$client/lib/GameState';
import ScoresStore from '../stores/scores';
import UsernameStore from '../stores/username';
import SocketStore from '../stores/socket';
import IdStore from '../stores/id';
import NotificationStore from '../stores/notification';
import usernameGenerator from '../../utils/username.generator';
import type Player from '../lib/Player';
import type Room from '../lib/Room';
import CurrentRoomStore from '../stores/currentRoom';
import OpponentReadyStore from '../stores/opponentReady';
import PiecesStore from '../stores/pieces';
import WinnerStore from '../stores/winner';
import GameStartStore from '../stores/gameStart';
import BoardsStore from '../stores/boards';
import NextPiecesStore from '../stores/nextPieces';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import type GameBoard from '../lib/GameBoard';
import type GamePiece from '../lib/GamePiece';
import type { NextGamePiece } from '../lib/GamePiece';

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
		username = usernameGenerator();
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
		BoardsStore.clean();
		GameStartStore.startIn(seconds);
	});

	socket.on('matchmaking:found', (room: Room) => {
		CurrentRoomStore.set(room);
		WinnerStore.remove();
		NotificationStore.push({ id: nanoid(), message: 'room founded', error: false });
		goto('/room');
	});

	socket.on('game:initialState', () => {
		NotificationStore.push({ id: nanoid(), message: 'the game will start', error: false });
	});

	socket.on('game:start', () => {
		GameStartStore.start();
		goto('/game');
	});

	socket.on('game:board', (board: GameBoard) => {
		BoardsStore.refreshBoard(board);
		if (board.player === 0 || board.player === 1) ScoresStore.update(board.player, board.score);
	});

	socket.on('game:nextPieces', (player: number, pieces: NextGamePiece[]) => {
		NextPiecesStore.updateNextPieces(player, pieces);
	});

	socket.on('room:playerLeft', (player: Player, room: Room) => {
		if (room.id == get(CurrentRoomStore)?.id && player.id != get(IdStore)) {
			NotificationStore.push({ id: nanoid(), message: 'player left', error: false });
			CurrentRoomStore.set(room);
			OpponentReadyStore.set(false);
		}
	});

	socket.on('room:playerJoined', (player: Player, room: Room) => {
		if (room.id == get(CurrentRoomStore)?.id) {
			NotificationStore.push({ id: nanoid(), message: 'player joined', error: false });
			CurrentRoomStore.set(room);
		}
	});

	socket.on('game:over', (winner: number) => {
		GameStartStore.remove();
		if (winner === 0 || winner === 1) {
			NotificationStore.push({ id: nanoid(), message: 'game over', error: false });
			WinnerStore.set(winner);
		}
	});

	socket.on('room:playerReady', (player: Player, ready: boolean) => {
		if (
			get(CurrentRoomStore)?.players[0].id === player.id ||
			get(CurrentRoomStore)?.players[1].id === player.id
		) {
			if (player.id != get(IdStore)) {
				OpponentReadyStore.set(ready);
				NotificationStore.push({
					id: nanoid(),
					message: `opponent ${ready ? '' : 'not '}ready`,
					error: false
				});
			}
		}
	});

	socket.on('game:piece', (piece: GamePiece) => {
		PiecesStore.updatePiece(piece);
	});

	socket.on('player:id', (id: string) => {
		IdStore.set(id);
		NotificationStore.push({ id: nanoid(), message: 'id: ' + id, error: false });
	});

	socket.on('connect', () => {
		SocketStore.set('connect');
		NotificationStore.push({ id: nanoid(), message: 'server: connected', error: false });
	});

	socket.on('disconnect', () => {
		SocketStore.set('disconnect');
		NotificationStore.push({ id: nanoid(), message: 'server: disconnected', error: true });
	});

	socket.io.on('error', () => {
		SocketStore.set('error');
		NotificationStore.push({ id: nanoid(), message: 'server: error', error: true });
	});

	socket.io.on('reconnect', () => {
		SocketStore.set('reconnect');
		NotificationStore.push({ id: nanoid(), message: 'server: reconnected', error: false });
	});

	socket.io.on('reconnect_attempt', () => {
		SocketStore.set('reconnect_attempt');
		NotificationStore.push({ id: nanoid(), message: 'server: reconnection attempt', error: false });
	});

	socket.io.on('reconnect_error', () => {
		SocketStore.set('reconnect_error');
		NotificationStore.push({ id: nanoid(), message: 'server: reconnection error', error: true });
	});

	socket.io.on('reconnect_failed', () => {
		SocketStore.set('reconnect_failed');
		NotificationStore.push({ id: nanoid(), message: 'server: reconnection failed', error: true });
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

/// @ts-expect-error It is defined when used in browser mode
export default socket;
