import { nanoid } from 'nanoid';
import { getRandomInt } from '$utils/random';
import {
	cleanupWebSocketTestServer,
	connectTestWebSocket,
	setupWebSocketTestServer
} from '$utils/test';
import RoomManager from '$server/RoomManager';
import { COLUMNS } from '$server/lib/Board';
import PlayerManager from '$server/PlayerManager';

describe('Game events', () => {
	const username = `Player#${getRandomInt(1000, 9999)}`;

	beforeAll(async () => {
		setupWebSocketTestServer();
	});

	afterAll(() => {
		cleanupWebSocketTestServer();
	});

	it('Can call the move action', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		// Create the room and start the game
		let roomId = '';
		await new Promise((resolve) => {
			socket.emit('room:create', 'My room', (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('room:ready', (ok, error) => {
				expect(ok).toBe(true);
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Start the game manually
		const roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();
		roomOnServer?.startGame();

		const yOffset =
			roomOnServer?.game?.boards[0].movingTetromino?.offset[1] ?? Math.floor(COLUMNS / 2);
		const expectOffset = [yOffset, 0];
		socket.on('game:piece', (piece) => {
			expect(piece.x).toBe(expectOffset[0]);
			expect(piece.y).toBe(expectOffset[1]);
		});

		await new Promise((resolve) => {
			expectOffset[0] -= 1;
			socket.emit('game:move:left', (ok) => {
				expect(ok).toBeTruthy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			expectOffset[0] += 1;
			socket.emit('game:move:right', (ok) => {
				expect(ok).toBeTruthy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			expectOffset[1] += 1;
			socket.emit('game:move:down', (ok) => {
				expect(ok).toBeTruthy();
				resolve(true);
			});
		});

		// Cleanup
		roomOnServer?.game?.gameOver(0);
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});

	it('Invalid moves return false', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		// Create the room and start the game
		let roomId = '';
		await new Promise((resolve) => {
			socket.emit('room:create', 'My room', (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('room:ready', (ok, error) => {
				expect(ok).toBe(true);
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Start the game manually
		const roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();
		if (roomOnServer && roomOnServer.game?.boards[0].movingTetromino) {
			roomOnServer.startGame();
			roomOnServer.game.boards[0].movingTetromino.offset[1] = 0;
		}

		await new Promise((resolve) => {
			socket.emit('game:move:left', (ok) => {
				expect(ok).toBeFalsy();
				resolve(true);
			});
		});

		if (roomOnServer && roomOnServer.game?.boards[0].movingTetromino) {
			roomOnServer.startGame();
			const movingTetromino = roomOnServer.game.boards[0].movingTetromino;
			movingTetromino.offset[1] = COLUMNS - movingTetromino.matrix.length;
		}

		await new Promise((resolve) => {
			socket.emit('game:move:right', (ok) => {
				expect(ok).toBeFalsy();
				resolve(true);
			});
		});

		// Cleanup
		roomOnServer?.game?.gameOver(0);
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});

	it('Can call the rotate action', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		// Create the room and start the game
		let roomId = '';
		await new Promise((resolve) => {
			socket.emit('room:create', 'My room', (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('room:ready', (ok, error) => {
				expect(ok).toBe(true);
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Start the game manually
		const roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();
		roomOnServer?.startGame();

		for (let index = 0; index < 4; index++) {
			await new Promise((resolve) => {
				socket.emit('game:rotate:clockwise', (ok) => {
					expect(ok).toBeTruthy();
					resolve(true);
				});
			});
		}

		for (let index = 0; index < 4; index++) {
			await new Promise((resolve) => {
				socket.emit('game:rotate:counter-clockwise', (ok) => {
					expect(ok).toBeTruthy();
					resolve(true);
				});
			});
		}

		// Cleanup
		roomOnServer?.game?.gameOver(0);
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});

	it('Can call the dash action', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		// Create the room and start the game
		let roomId = '';
		await new Promise((resolve) => {
			socket.emit('room:create', 'My room', (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('room:ready', (ok, error) => {
				expect(ok).toBe(true);
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Start the game manually
		const roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();
		roomOnServer?.startGame();

		await new Promise((resolve) => {
			socket.emit('game:dash', (ok) => {
				expect(ok).toBeTruthy();
				resolve(true);
			});
		});

		const score = roomOnServer?.game?.score[0];
		expect(roomOnServer?.game?.score[0]).toBeGreaterThan(0);

		await new Promise((resolve) => {
			socket.emit('game:dash', (ok) => {
				expect(ok).toBeTruthy();
				resolve(true);
			});
		});

		expect(roomOnServer?.game?.score[0]).toBeGreaterThan(score ?? 1000);

		// Cleanup
		roomOnServer?.game?.gameOver(0);
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});

	it('Can concede the game', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		// Create the room and start the game
		let roomId = '';
		await new Promise((resolve) => {
			socket.emit('room:create', 'My room', (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('room:ready', (ok, error) => {
				expect(ok).toBe(true);
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Start the game manually
		const roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();
		roomOnServer?.startGame();

		await new Promise((resolve) => {
			socket.emit('game:concede', (ok) => {
				expect(ok).toBeTruthy();
				resolve(true);
			});
		});

		expect(roomOnServer?.game?.winner).toBe(0);

		// Cleanup
		roomOnServer?.game?.gameOver(0);
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});

	it('Can\t call game actions while not in a game', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		await new Promise((resolve) => {
			socket.emit('game:move:left', (ok) => {
				expect(ok).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('game:move:right', (ok) => {
				expect(ok).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('game:move:down', (ok) => {
				expect(ok).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('game:rotate:clockwise', (ok) => {
				expect(ok).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('game:rotate:counter-clockwise', (ok) => {
				expect(ok).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('game:dash', (ok) => {
				expect(ok).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('game:concede', (ok) => {
				expect(ok).toBeFalsy();
				resolve(true);
			});
		});

		// Cleanup
		socket.disconnect();
	});
});
