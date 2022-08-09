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

describe('Test Game', () => {
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
			socket.emit('room:create', 'My room', (room, error) => {
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
			socket.emit('room:create', 'My second room', (room, error) => {
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
			socket.emit('room:create', 'My room', (room, error) => {
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
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		let roomId = '';
		await new Promise((resolve) => {
			socketOne.emit('room:create', 'My room', (room, error) => {
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
			socketOne.emit('room:create', 'My room', (room, error) => {
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
			socketOne.emit('room:create', 'My room', (room, error) => {
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
		const room = new Room('test');
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
			socketOne.emit('room:create', 'My room', (room, error) => {
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
});
