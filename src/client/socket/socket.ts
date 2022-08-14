import { nanoid } from 'nanoid';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { browser } from '$app/env';
import type Room from '$client/lib/Room';
import type { ServerToClientEvents, ClientToServerEvents } from 'src/socket';
import scores from '$client/stores/scores';
import type { GameInitialState } from '$client/lib/GameState';
import level from '$client/stores/level';
import type GameState from '$client/lib/GameState';
import username from '$client/stores/username';
import playerSocket from '$client/stores/socket';
import id from '$client/stores/id';
import notifications from '$client/stores/notification';
import usernameGenerator from '$utils/username.generator';
import type Player from '$client/lib/Player';
import currentRoom from '$client/stores/currentRoom';
import search from '$client/stores/search';
import rooms from '$client/stores/rooms';
import opponentReady from '$client/stores/opponentReady';
import pieces from '$client/stores/pieces';
import winner from '$client/stores/winner';
import gameStart from '$client/stores/gameStart';
import boards from '$client/stores/boards';
import nextPieces from '$client/stores/nextPieces';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import type GameBoard from '$client/lib/GameBoard';
import type GamePiece from '$client/lib/GamePiece';
import type { NextGamePiece } from '$client/lib/GamePiece';
import * as Sounds from '$client/effects/sounds';
import { roomMatchAny as RoomMatchAny } from '$shared/Match';

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

function cleanStores() {
	boards.clean();
	level.set(0);
	scores.update(0, 0);
	scores.update(1, 0);
	winner.remove();
}

if (browser) {
	playerSocket.set('');
	let token = localStorage.getItem('token');
	if (!token) {
		token = nanoid();
		localStorage.setItem('token', token);
	}
	let storageUsername = localStorage.getItem('username');
	if (storageUsername == null) {
		storageUsername = usernameGenerator();
		localStorage.setItem('username', storageUsername);
		username.set(storageUsername);
	}
	username.set(storageUsername);

	socket = io({
		auth: { token, username: storageUsername },
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
		reconnectionAttempts: 5
	});

	socket.on('game:startIn', (seconds: number) => {
		boards.clean();
		gameStart.startIn(seconds);
	});

	socket.on('room:current', (room: Room | null) => {
		if (room != null) {
			cleanStores();

			currentRoom.set(room);
			goto('/room');
		}
	});

	socket.on('game:current', (state: GameState | null) => {
		if (state != null) {
			cleanStores();

			// global
			level.set(state.playerOne.board.level);
			// player one
			boards.refreshBoard(state.playerOne.board);
			if (state.playerOne.current != undefined) pieces.updatePiece(state.playerOne.current);
			scores.update(0, state.playerOne.board.score);
			nextPieces.updateNextPieces(0, state.playerOne.next);
			// player two
			if (state.playerTwo != undefined) {
				boards.refreshBoard(state.playerTwo.board);
				if (state.playerTwo.current != undefined) pieces.updatePiece(state.playerTwo.current);
				scores.update(1, state.playerTwo.board.score);
				nextPieces.updateNextPieces(1, state.playerTwo.next);
			}
			goto('/game');
		}
	});

	socket.on('room:kicked', () => {
		Sounds.cancel();
		currentRoom.clean();
		notifications.push({ id: nanoid(), message: 'you have been kicked', error: true });
		goto('/search');
	});

	socket.on('matchmaking:found', (room: Room) => {
		currentRoom.set(room);
		winner.remove();
		notifications.push({ id: nanoid(), message: 'room founded', error: false });
		goto('/room');
	});

	socket.on('game:initialState', (playerOne: GameInitialState, playerTwo?: GameInitialState) => {
		notifications.push({ id: nanoid(), message: 'the game will start', error: false });

		scores.clean();
		boards.clean();

		// player one
		nextPieces.updateNextPieces(0, playerOne.next);
		if (playerOne.current != undefined) pieces.updatePiece(playerOne.current);

		// player two
		if (playerTwo != undefined) {
			nextPieces.updateNextPieces(1, playerTwo.next);
			if (playerTwo.current != undefined) pieces.updatePiece(playerTwo.current);
		}
	});

	socket.on('room:playerJoined', (player: Player, room: Room) => {
		rooms.updateRoom(room);
	});

	socket.on('room:playerLeft', (player: Player, room: Room) => {
		rooms.updateRoom(room);
	});

	socket.on('room:deleted', (roomId: string) => {
		rooms.removeRoom(roomId);
	});

	socket.on('room:created', (room: Room) => {
		if (get(search).length === 0 || RoomMatchAny(room, get(search))) rooms.addRoom(room);
	});

	socket.on('game:start', () => {
		gameStart.start();
		goto('/game');
	});

	socket.on('game:board', (board: GameBoard) => {
		boards.refreshBoard(board);
		level.set(board.level);
		if (board.tetris) Sounds.tetris();
		else if (board.blockedLine) Sounds.addPenalty();
		else if (board.touched) Sounds.touchFloor();
		if (board.player === 0 || board.player === 1) scores.update(board.player, board.score);
	});

	socket.on('game:nextPieces', (player: number, pieces: NextGamePiece[]) => {
		nextPieces.updateNextPieces(player, pieces);
	});

	socket.on('room:playerLeft', (player: Player, room: Room) => {
		if (room.id == get(currentRoom)?.id && player.id != get(id)) {
			notifications.push({ id: nanoid(), message: 'player left', error: false });
			currentRoom.set(room);
			opponentReady.set(false);
		}
	});

	socket.on('room:playerJoined', (player: Player, room: Room) => {
		if (room.id == get(currentRoom)?.id) {
			notifications.push({ id: nanoid(), message: 'player joined', error: false });
			currentRoom.set(room);
		}
	});

	socket.on('game:over', (gameWinner: number) => {
		gameStart.remove();
		if (gameWinner === 0 || gameWinner === 1) {
			Sounds.gameOver();
			notifications.push({ id: nanoid(), message: 'game over', error: false });
			winner.set(gameWinner);
		}
	});

	socket.on('room:playerReady', (player: Player, ready: boolean) => {
		if (
			get(currentRoom)?.players[0].id === player.id ||
			get(currentRoom)?.players[1].id === player.id
		) {
			if (player.id != get(id)) {
				opponentReady.set(ready);
				notifications.push({
					id: nanoid(),
					message: `opponent ${ready ? '' : 'not '}ready`,
					error: false
				});
			}
		}
	});

	socket.on('game:piece', (piece: GamePiece) => {
		pieces.updatePiece(piece);
	});

	socket.on('player:id', (playerId: string) => {
		id.set(playerId);
		notifications.push({ id: nanoid(), message: `id: ${playerId}`, error: false });
	});

	socket.on('connect', () => {
		playerSocket.set('connect');
		notifications.push({ id: nanoid(), message: 'server: connected', error: false });
	});

	socket.on('disconnect', () => {
		playerSocket.set('disconnect');
		notifications.push({ id: nanoid(), message: 'server: disconnected', error: true });
	});

	socket.io.on('error', () => {
		playerSocket.set('error');
		notifications.push({ id: nanoid(), message: 'server: error', error: true });
	});

	socket.io.on('reconnect', () => {
		playerSocket.set('reconnect');
		notifications.push({ id: nanoid(), message: 'server: reconnected', error: false });
	});

	socket.io.on('reconnect_attempt', () => {
		playerSocket.set('reconnect_attempt');
		notifications.push({ id: nanoid(), message: 'server: reconnection attempt', error: false });
	});

	socket.io.on('reconnect_error', () => {
		playerSocket.set('reconnect_error');
		notifications.push({ id: nanoid(), message: 'server: reconnection error', error: true });
	});

	socket.io.on('reconnect_failed', () => {
		playerSocket.set('reconnect_failed');
		notifications.push({ id: nanoid(), message: 'server: reconnection failed', error: true });
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
