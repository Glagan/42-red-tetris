import { nanoid } from 'nanoid';
import { getRandomInt } from '$utils/random';
import {
	cleanupWebSocketTestServer,
	connectTestWebSocket,
	setupWebSocketTestServer
} from '$utils/test';
import PlayerManager from '$server/PlayerManager';
import RoomManager from '$server/RoomManager';

describe('Matchmaking events', () => {
	const username = `Player#${getRandomInt(1000, 9999)}`;
	const usernameTwo = `Player#${getRandomInt(1000, 9999)}`;

	beforeAll(async () => {
		setupWebSocketTestServer();
	});

	afterAll(() => {
		cleanupWebSocketTestServer();
	});

	it('Can enter and leave matchmaking', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		await new Promise((resolve) => {
			socket.emit('matchmaking:join', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('matchmaking:join', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('matchmaking:leave', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('matchmaking:leave', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Cleanup
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});

	it("Can't enter matchmaking while already in a room", async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		// Create a room
		await new Promise((resolve) => {
			socket.emit('room:create', nanoid(), (room, error) => {
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('matchmaking:join', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('matchmaking:leave', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Cleanup
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});

	it('Can find a opponent trough matchmaking', async () => {
		const tokenOne = nanoid();
		const socketOne = await connectTestWebSocket(tokenOne, username);
		const tokenTwo = nanoid();
		const socketTwo = await connectTestWebSocket(tokenTwo, usernameTwo);

		// Add condition to check that matchmaking was found

		const resolvers: ((value: boolean) => void)[] = [];
		const promises = [
			new Promise<boolean>((resolve) => {
				resolvers.push(resolve);
			}),
			new Promise<boolean>((resolve) => {
				resolvers.push(resolve);
			})
		];
		let roomId: undefined | string = undefined;
		let matchmakingFoundReceived = 0;
		socketOne.on('matchmaking:found', (room) => {
			matchmakingFoundReceived += 1;
			resolvers[0](true);
			if (roomId) {
				expect(roomId).toBe(room.id);
			} else {
				roomId = room.id;
			}
		});

		socketTwo.on('matchmaking:found', (room) => {
			matchmakingFoundReceived += 1;
			resolvers[1](true);
			if (roomId) {
				expect(roomId).toBe(room.id);
			} else {
				roomId = room.id;
			}
		});

		// Join matchmaking on both sockets
		await new Promise((resolve) => {
			socketOne.emit('matchmaking:join', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('matchmaking:join', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await Promise.all(promises);
		expect(matchmakingFoundReceived).toBe(2);
		if (roomId) {
			expect(RoomManager.getRoom(roomId)).toBeTruthy();
		}

		// Cleanup
		PlayerManager.get(tokenOne).leaveCurrentRoom();
		PlayerManager.get(tokenTwo).leaveCurrentRoom();
		socketOne.disconnect();
		socketTwo.disconnect();
	});

	it('Can find a room trough matchmaking', async () => {
		const tokenOne = nanoid();
		const socketOne = await connectTestWebSocket(tokenOne, username);
		const tokenTwo = nanoid();
		const socketTwo = await connectTestWebSocket(tokenTwo, usernameTwo);

		const resolvers: ((value: boolean) => void)[] = [];
		const promises = [
			new Promise<boolean>((resolve) => {
				resolvers.push(resolve);
			}),
			new Promise<boolean>((resolve) => {
				resolvers.push(resolve);
			})
		];
		let roomId: undefined | string = undefined;
		let matchmakingFoundReceived = 0;
		socketOne.once('matchmaking:found', (room) => {
			matchmakingFoundReceived += 1;
			resolvers[0](true);
			if (roomId) {
				expect(roomId).toBe(room.id);
			} else {
				roomId = room.id;
			}
		});

		socketTwo.once('matchmaking:found', (room) => {
			matchmakingFoundReceived += 1;
			resolvers[1](true);
			if (roomId) {
				expect(roomId).toBe(room.id);
			} else {
				roomId = room.id;
			}
		});

		// Join matchmaking on both sockets
		await new Promise((resolve) => {
			socketOne.emit('matchmaking:join', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('matchmaking:join', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await Promise.all(promises);
		expect(matchmakingFoundReceived).toBe(2);
		if (roomId) {
			expect(RoomManager.getRoom(roomId)).toBeTruthy();
		}

		// Make the second player leave and search again
		// -- it should join the same matchmaking room

		await new Promise((resolve) => {
			socketTwo.emit('room:leave', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		let resolver: (value: boolean) => void;
		const promise = new Promise((resolve) => {
			resolver = resolve;
		});
		socketTwo.once('matchmaking:found', (room) => {
			expect(room.id).toBe(roomId);
			resolver(true);
		});

		await new Promise((resolve) => {
			socketTwo.emit('matchmaking:join', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await promise;

		// Cleanup
		PlayerManager.get(tokenOne).leaveCurrentRoom();
		PlayerManager.get(tokenTwo).leaveCurrentRoom();
		socketOne.disconnect();
		socketTwo.disconnect();
	});
});
