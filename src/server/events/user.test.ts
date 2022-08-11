import { nanoid } from 'nanoid';
import { getRandomInt } from '$utils/random';
import {
	cleanupWebSocketTestServer,
	connectTestWebSocket,
	setupWebSocketTestServer
} from '$utils/test';
import PlayerManager from '$server/PlayerManager';

describe('User events', () => {
	const username = `Player#${getRandomInt(1000, 9999)}`;

	beforeAll(async () => {
		setupWebSocketTestServer();
	});

	afterAll(() => {
		cleanupWebSocketTestServer();
	});

	it('Can set a valid username', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		expect(PlayerManager.get(token).name).toBe(username);

		await new Promise((resolve) => {
			socket.emit('set:username', 'Player#test', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});
		expect(PlayerManager.get(token).name).toBe('Player#test');

		await new Promise((resolve) => {
			socket.emit('set:username', '', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});
		expect(PlayerManager.get(token).name).toBe('Player#test');

		await new Promise((resolve) => {
			socket.emit('set:username', new Array(250).fill('h').join(''), (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});
		expect(PlayerManager.get(token).name).toBe('Player#test');

		// Cleanup
		socket.disconnect();
	});

	it("Can't set it's username while in a room or matchmaking", async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		expect(PlayerManager.get(token).name).toBe(username);

		// * Matchmaking

		await new Promise((resolve) => {
			socket.emit('matchmaking:join', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('set:username', 'Player#test', (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});
		expect(PlayerManager.get(token).name).toBe(username);

		await new Promise((resolve) => {
			socket.emit('matchmaking:leave', (ok, error) => {
				expect(ok).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		// * Manual room

		await new Promise((resolve) => {
			socket.emit('room:create', nanoid(), (room, error) => {
				expect(room).toBeTruthy();
				expect(error).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('set:username', new Array(250).fill('h').join(''), (ok, error) => {
				expect(ok).toBeFalsy();
				expect(error).toBeTruthy();
				resolve(true);
			});
		});
		expect(PlayerManager.get(token).name).toBe(username);

		// Cleanup
		PlayerManager.get(token).leaveCurrentRoom();
		socket.disconnect();
	});
});
