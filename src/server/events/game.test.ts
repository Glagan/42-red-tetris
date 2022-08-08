import { nanoid } from 'nanoid';
import { getRandomInt } from '$utils/random';
import type { ClientToServerEvents, ServerToClientEvents } from 'src/socket';
import {
	cleanupWebSocketTestServer,
	connectTestWebSocket,
	setupWebSocketTestServer
} from '$utils/test';
import type { Socket } from 'socket.io-client';

describe('Test Game', () => {
	const token = nanoid();
	const username = `Player#${getRandomInt(1000, 9999)}`;

	let socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	beforeAll(async () => {
		setupWebSocketTestServer();
		socket = await connectTestWebSocket(token, username);
	});

	afterAll(() => {
		socket.disconnect();
		cleanupWebSocketTestServer();
	});

	it('Can dash', async () => {
		await new Promise((resolve) => {
			socket.emit('game:dash', (ok) => {
				expect(ok).toBeFalsy();
				resolve(true);
			});
		});

		await new Promise((resolve) => {
			socket.emit('room:create', 'My room', (room, error) => {
				resolve(true);
			});
		});
	});
});
