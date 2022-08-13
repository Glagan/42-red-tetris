import { nanoid } from 'nanoid';
import { getRandomInt } from '$utils/random';
import {
	cleanupWebSocketTestServer,
	connectTestWebSocket,
	setupWebSocketTestServer
} from '$utils/test';
import PlayerManager from '$server/PlayerManager';
import RoomManager from '$server/RoomManager';
import Room from '$server/lib/Room';
import type ClientRoom from '$client/lib/Room';

describe('Room events', () => {
	const username = `Player#${getRandomInt(1000, 9999)}`;
	const usernameTwo = `Player#${getRandomInt(1000, 9999)}`;
	const usernameThree = `Player#${getRandomInt(1000, 9999)}`;

	beforeAll(async () => {
		setupWebSocketTestServer();
	});

	afterAll(() => {
		cleanupWebSocketTestServer();
	});

	it('Can create a room', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		let roomId = '';
		await new Promise((resolve) => {
			socket.emit('room:create', nanoid(), (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		let roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();

		await new Promise((resolve) => {
			socket.emit('room:create', nanoid(), (room, error) => {
				expect(room).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();

		await new Promise((resolve) => {
			socket.emit('room:leave', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('room:create', new Array(250).fill('h').join(''), (room, error) => {
				expect(room).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		// Cleanup
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});

	it("Can't create a duplicate room", async () => {
		const tokenOne = nanoid();
		const socketOne = await connectTestWebSocket(tokenOne, username);
		const tokenTwo = nanoid();
		const socketTwo = await connectTestWebSocket(tokenTwo, usernameTwo);
		const roomName = nanoid();

		await new Promise((resolve) => {
			socketOne.emit('room:create', roomName, (room, error) => {
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:create', roomName, (room, error) => {
				expect(room).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		// Cleanup
		PlayerManager.get(tokenOne).leaveCurrentRoom();
		PlayerManager.get(tokenTwo).leaveCurrentRoom();
		socketOne.disconnect();
		socketTwo.disconnect();
	});

	it('Can get a room', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		await new Promise((resolve) => {
			socket.emit('room:get', '', (room, error) => {
				expect(room).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('room:get', nanoid(), (room, error) => {
				expect(room).toBeNull();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		let roomId = '';
		await new Promise((resolve) => {
			socket.emit('room:create', nanoid(), (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		const roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();

		await new Promise((resolve) => {
			socket.emit('room:get', roomId, (room, error) => {
				expect(room).toEqual(roomOnServer?.toClient());
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Cleanup
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});

	it('Can join and leave a room', async () => {
		const tokenOne = nanoid();
		const socketOne = await connectTestWebSocket(tokenOne, username);
		const tokenTwo = nanoid();
		const socketTwo = await connectTestWebSocket(tokenTwo, usernameTwo);
		const tokenThree = nanoid();
		const socketThree = await connectTestWebSocket(tokenThree, usernameThree);

		await new Promise((resolve) => {
			socketOne.emit('room:join', nanoid(), (room, error) => {
				expect(room).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketOne.emit('room:leave', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		let roomId = '';
		await new Promise((resolve) => {
			socketOne.emit('room:create', nanoid(), (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketOne.emit('room:join', roomId, (room, error) => {
				expect(room).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		let roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();

		await new Promise((resolve) => {
			socketTwo.emit('room:join', roomId, (room, error) => {
				expect(room?.id).toBe(roomId);
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketThree.emit('room:join', roomId, (room, error) => {
				expect(room).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:leave', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();

		await new Promise((resolve) => {
			socketOne.emit('room:leave', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeFalsy();

		// Cleanup
		PlayerManager.get(tokenOne).leaveCurrentRoom();
		PlayerManager.get(tokenTwo).leaveCurrentRoom();
		PlayerManager.get(tokenThree).leaveCurrentRoom();
		socketOne.disconnect();
		socketTwo.disconnect();
		socketThree.disconnect();
	});

	it("Can't leave a room while in a game", async () => {
		const tokenOne = nanoid();
		const socketOne = await connectTestWebSocket(tokenOne, username);
		const tokenTwo = nanoid();
		const socketTwo = await connectTestWebSocket(tokenTwo, usernameTwo);

		let roomId = '';
		await new Promise((resolve) => {
			socketOne.emit('room:create', nanoid(), (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:join', roomId, (room, error) => {
				expect(room?.id).toBe(roomId);
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketOne.emit('room:ready', (ready, error) => {
				expect(ready).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:ready', (ready, error) => {
				expect(ready).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		const roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();
		expect(roomOnServer?.game).toBeTruthy();
		roomOnServer?.startGame();

		await new Promise((resolve) => {
			socketOne.emit('room:leave', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:leave', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		// Cleanup
		roomOnServer?.game?.gameOver(0);
		PlayerManager.get(tokenOne).leaveCurrentRoom();
		PlayerManager.get(tokenTwo).leaveCurrentRoom();
		socketOne.disconnect();
		socketTwo.disconnect();
	});

	it('Can ready up in a room', async () => {
		const tokenOne = nanoid();
		const socketOne = await connectTestWebSocket(tokenOne, username);
		const tokenTwo = nanoid();
		const socketTwo = await connectTestWebSocket(tokenTwo, usernameTwo);

		await new Promise((resolve) => {
			socketOne.emit('room:ready', (ready, error) => {
				expect(ready).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		let roomId = '';
		await new Promise((resolve) => {
			socketOne.emit('room:create', nanoid(), (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:join', roomId, (room, error) => {
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		socketTwo.once('room:playerReady', (player, ready) => {
			expect(player.name).toBe(username);
			expect(ready).toBeTruthy();
		});

		await new Promise((resolve) => {
			socketOne.emit('room:ready', (ready, error) => {
				expect(ready).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		socketTwo.once('room:playerReady', (player, ready) => {
			expect(player.name).toBe(username);
			expect(ready).toBeTruthy();
		});

		await new Promise((resolve) => {
			socketOne.emit('room:ready', (ready, error) => {
				expect(ready).toBeFalsy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Both players ready up

		await new Promise((resolve) => {
			socketOne.emit('room:ready', (ready, error) => {
				expect(ready).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:ready', (ready, error) => {
				expect(ready).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketOne.emit('room:ready', (ready, error) => {
				expect(ready).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:ready', (ready, error) => {
				expect(ready).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		// Cleanup
		const roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();
		roomOnServer?.game?.gameOver(0);
		PlayerManager.get(tokenOne).leaveCurrentRoom();
		PlayerManager.get(tokenTwo).leaveCurrentRoom();
		socketOne.disconnect();
		socketTwo.disconnect();
	});

	it('Can search for rooms', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		await new Promise((resolve) => {
			socket.emit('room:search', '', (rooms, error) => {
				expect(rooms).toEqual(RoomManager.all());
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Manually create a room
		const room = new Room('test search');
		RoomManager.addRoom(room);

		await new Promise((resolve) => {
			socket.emit('room:search', 'test', (rooms, error) => {
				expect(rooms).toEqual([room.toClient()]);
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('room:search', nanoid(), (rooms, error) => {
				expect(rooms).toEqual([]);
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('room:search', new Array(250).fill('h').join(''), (rooms, error) => {
				expect(rooms).toEqual([]);
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		// Cleanup
		RoomManager.removeRoom(room.id);
		socket.disconnect();
	});

	it('Get a truncated list of rooms', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		// Manually create rooms
		const rooms: string[] = [];
		for (let index = 0; index < 100; index++) {
			const room = new Room(`Room#${index + 1}`);
			RoomManager.addRoom(room);
			rooms.push(room.id);
		}

		await new Promise((resolve) => {
			socket.emit('room:search', '', (rooms, error) => {
				expect(rooms.length).toEqual(50);
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('room:search', 'Room', (rooms, error) => {
				expect(rooms.length).toEqual(50);
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Cleanup
		for (const roomId of rooms) {
			RoomManager.removeRoom(roomId);
		}
		socket.disconnect();
	});

	it('Can kick a player from a room', async () => {
		const tokenOne = nanoid();
		const socketOne = await connectTestWebSocket(tokenOne, username);
		const tokenTwo = nanoid();
		const socketTwo = await connectTestWebSocket(tokenTwo, usernameTwo);

		await new Promise((resolve) => {
			socketOne.emit('room:kick', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		let roomId = '';
		await new Promise((resolve) => {
			socketOne.emit('room:create', nanoid(), (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketOne.emit('room:kick', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:join', roomId, (room, error) => {
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:kick', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});

		let resolver: (value: boolean) => void;
		const promise = new Promise((resolve) => {
			resolver = resolve;
		});
		socketTwo.once('room:kicked', () => {
			resolver(true);
		});

		await new Promise((resolve) => {
			socketOne.emit('room:kick', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await promise;

		const roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();
		expect(roomOnServer?.players.length).toBe(1);
		expect(PlayerManager.get(tokenTwo).room).toBeUndefined();

		// Cleanup
		PlayerManager.get(tokenOne).leaveCurrentRoom();
		PlayerManager.get(tokenTwo).leaveCurrentRoom();
		socketOne.disconnect();
		socketTwo.disconnect();
	});

	it('Player disconnect reset ready status', async () => {
		const tokenOne = nanoid();
		const socketOne = await connectTestWebSocket(tokenOne, username);
		const tokenTwo = nanoid();
		const socketTwo = await connectTestWebSocket(tokenTwo, usernameTwo);

		let roomId = '';
		await new Promise((resolve) => {
			socketOne.emit('room:create', nanoid(), (room, error) => {
				if (room) {
					roomId = room.id;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:join', roomId, (room, error) => {
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:ready', (ready, error) => {
				expect(ready).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		const roomOnServer = RoomManager.getRoom(roomId);
		expect(roomOnServer).toBeTruthy();
		if (roomOnServer) {
			expect(roomOnServer.ready.length).toBe(1);
		}

		let resolver: (value: boolean) => void;
		const promise = new Promise((resolve) => {
			resolver = resolve;
		});
		socketOne.once('room:playerReady', (player, ready) => {
			expect(player.id).toBe(roomOnServer?.players[1].id);
			expect(ready).toBeFalsy();
			resolver(true);
		});

		socketTwo.disconnect();
		await promise;

		if (roomOnServer) {
			expect(roomOnServer.ready.length).toBe(0);
		}

		// Cleanup
		PlayerManager.get(tokenOne).leaveCurrentRoom();
		PlayerManager.get(tokenTwo).leaveCurrentRoom();
		socketOne.disconnect();
		socketTwo.disconnect();
	});

	it('Correctly receive room:current on reconnect', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		let expectedRoom: ClientRoom;
		await new Promise((resolve) => {
			socket.emit('room:create', nanoid(), (room, error) => {
				if (room) {
					expectedRoom = room;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		socket.disconnect();

		// check room:current on the next reconnect
		const resolvers: ((value: boolean) => void)[] = [];
		const promises = [
			new Promise((resolve) => {
				resolvers.push(resolve);
			}),
			new Promise((resolve) => {
				resolvers.push(resolve);
			})
		];
		socket.once('room:current', (room) => {
			expect(room).toStrictEqual(expectedRoom);
			resolvers[0](true);
		});

		socket.once('game:current', (state) => {
			expect(state).toBeNull();
			resolvers[1](true);
		});

		socket.connect();

		await Promise.all(promises);

		// Cleanup
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});

	it('Correctly receive game:current on reconnect 1', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		let expectedRoom: ClientRoom;
		await new Promise((resolve) => {
			socket.emit('room:create', nanoid(), (room, error) => {
				if (room) {
					expectedRoom = room;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Start a game manually
		await new Promise((resolve) => {
			socket.emit('room:ready', (ready, error) => {
				expect(ready).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		/// @ts-expect-error It exists
		const roomOnServer = RoomManager.getRoom(expectedRoom.id);
		expect(roomOnServer).toBeTruthy();
		if (roomOnServer) {
			roomOnServer.startGame();
		}

		socket.disconnect();

		// Check game:current on the next reconnect
		let resolver: (value: boolean) => void;
		const promise = new Promise((resolve) => {
			resolver = resolve;
		});
		socket.once('game:current', (state) => {
			expect(state?.playerOne.id).toBe(roomOnServer?.players[0]?.id);
			expect(state?.playerTwo).toBeUndefined();
			resolver(true);
		});

		socket.connect();

		await promise;

		// Cleanup
		roomOnServer?.game?.gameOver(0);
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});

	it('Correctly receive game:current on reconnect 2', async () => {
		const tokenOne = nanoid();
		const socketOne = await connectTestWebSocket(tokenOne, username);
		const tokenTwo = nanoid();
		const socketTwo = await connectTestWebSocket(tokenTwo, username);

		let expectedRoom: ClientRoom;
		await new Promise((resolve) => {
			socketOne.emit('room:create', nanoid(), (room, error) => {
				if (room) {
					expectedRoom = room;
				}
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socketTwo.emit('room:join', expectedRoom.id, (room, error) => {
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// Start a game manually
		await new Promise((resolve) => {
			socketOne.emit('room:ready', (ready, error) => {
				expect(ready).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});
		await new Promise((resolve) => {
			socketTwo.emit('room:ready', (ready, error) => {
				expect(ready).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		/// @ts-expect-error It exists
		const roomOnServer = RoomManager.getRoom(expectedRoom.id);
		expect(roomOnServer).toBeTruthy();
		if (roomOnServer) {
			roomOnServer.startGame();
		}

		socketOne.disconnect();

		// Check game:current on the next reconnect
		let resolver: (value: boolean) => void;
		const promise = new Promise((resolve) => {
			resolver = resolve;
		});
		socketOne.once('game:current', (state) => {
			expect(state?.playerOne.id).toBe(roomOnServer?.players[0]?.id);
			expect(state?.playerTwo?.id).toBe(roomOnServer?.players[1]?.id);
			resolver(true);
		});

		socketOne.connect();

		await promise;

		// Cleanup
		roomOnServer?.game?.gameOver(0);
		PlayerManager.get(tokenOne).leaveCurrentRoom();
		PlayerManager.get(tokenTwo).leaveCurrentRoom();
		socketOne.disconnect();
		socketTwo.disconnect();
	});
});
