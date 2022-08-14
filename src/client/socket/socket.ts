import { nanoid } from 'nanoid';
import { io, Socket } from 'socket.io-client';
import { browser } from '$app/env';
import type Room from '$client/lib/Room';
import type { ServerToClientEvents, ClientToServerEvents } from 'src/socket';
import ScoresStore from '$client/stores/scores';
import type { GameInitialState } from '$client/lib/GameState';
import LevelStore from '$client/stores/level';
import type GameState from '$client/lib/GameState';
import UsernameStore from '$client/stores/username';
import SocketStore from '$client/stores/socket';
import IdStore from '$client/stores/id';
import NotificationStore from '$client/stores/notification';
import usernameGenerator from '$utils/username.generator';
import type Player from '$client/lib/Player';
import CurrentRoomStore from '$client/stores/currentRoom';
import SearchStore from '$client/stores/search';
import RoomsStore from '$client/stores/rooms';
import OpponentReadyStore from '$client/stores/opponentReady';
import PiecesStore from '$client/stores/pieces';
import WinnerStore from '$client/stores/winner';
import GameStartStore from '$client/stores/gameStart';
import BoardsStore from '$client/stores/boards';
import NextPiecesStore from '$client/stores/nextPieces';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import type GameBoard from '$client/lib/GameBoard';
import type GamePiece from '$client/lib/GamePiece';
import type { NextGamePiece } from '$client/lib/GamePiece';
import * as Sounds from '$client/effects/sounds';
import { roomMatchAny as RoomMatchAny } from '$shared/Match';

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

function cleanStores() {
	BoardsStore.clean();
	LevelStore.set(0);
	ScoresStore.update(0, 0);
	ScoresStore.update(1, 0);
	WinnerStore.remove();
}

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

	socket.on('room:current', (room: Room | null) => {
		if (room != null) {
			cleanStores();

			CurrentRoomStore.set(room);
			goto('/room');
		}
	});

	socket.on('game:current', (state: GameState | null) => {
		if (state != null) {
			cleanStores();

			// global
			LevelStore.set(state.playerOne.board.level);
			// player one
			BoardsStore.refreshBoard(state.playerOne.board);
			if (state.playerOne.current != undefined) PiecesStore.updatePiece(state.playerOne.current);
			ScoresStore.update(0, state.playerOne.board.score);
			NextPiecesStore.updateNextPieces(0, state.playerOne.next);
			// player two
			if (state.playerTwo != undefined) {
				BoardsStore.refreshBoard(state.playerTwo.board);
				if (state.playerTwo.current != undefined) PiecesStore.updatePiece(state.playerTwo.current);
				ScoresStore.update(1, state.playerTwo.board.score);
				NextPiecesStore.updateNextPieces(1, state.playerTwo.next);
			}
			goto('/game');
		}
	});

	socket.on('room:kicked', () => {
		Sounds.cancel();
		CurrentRoomStore.clean();
		NotificationStore.push({ id: nanoid(), message: 'you have been kicked', error: true });
		goto('/search');
	});

	socket.on('matchmaking:found', (room: Room) => {
		CurrentRoomStore.set(room);
		WinnerStore.remove();
		NotificationStore.push({ id: nanoid(), message: 'room founded', error: false });
		goto('/room');
	});

	socket.on('game:initialState', (playerOne: GameInitialState, playerTwo?: GameInitialState) => {
		NotificationStore.push({ id: nanoid(), message: 'the game will start', error: false });

		ScoresStore.clean();
		BoardsStore.clean();

		// player one
		NextPiecesStore.updateNextPieces(0, playerOne.next);
		if (playerOne.current != undefined) PiecesStore.updatePiece(playerOne.current);

		// player two
		if (playerTwo != undefined) {
			NextPiecesStore.updateNextPieces(1, playerTwo.next);
			if (playerTwo.current != undefined) PiecesStore.updatePiece(playerTwo.current);
		}
	});

	socket.on('room:playerJoined', (player: Player, room: Room) => {
		RoomsStore.updateRoom(room);
	});

	socket.on('room:playerLeft', (player: Player, room: Room) => {
		RoomsStore.updateRoom(room);
	});

	socket.on('room:deleted', (roomId: string) => {
		RoomsStore.removeRoom(roomId);
	});

	socket.on('room:created', (room: Room) => {
		if (get(SearchStore).length === 0 || RoomMatchAny(room, get(SearchStore)))
			RoomsStore.addRoom(room);
	});

	socket.on('game:start', () => {
		GameStartStore.start();
		goto('/game');
	});

	socket.on('game:board', (board: GameBoard) => {
		BoardsStore.refreshBoard(board);
		LevelStore.set(board.level);
		if (board.tetris) Sounds.tetris();
		else if (board.blockedLine) Sounds.add_penalty();
		else if (board.touched) Sounds.touch_floor();
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
			Sounds.gameover();
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
