import { nanoid } from 'nanoid';
import { getRandomInt } from '$utils/random';
import {
	cleanupWebSocketTestServer,
	pendingTestWebSocket,
	setupWebSocketTestServer
} from '$utils/test';

describe('WebSocket server setup', () => {
	const username = `Player#${getRandomInt(1000, 9999)}`;

	beforeAll(async () => {
		setupWebSocketTestServer();
	});

	afterAll(() => {
		cleanupWebSocketTestServer();
	});

	it("Can't connect without a token", async () => {
		const socket = pendingTestWebSocket(undefined, username);

		let resolver: (valud: boolean) => void;
		const promise = new Promise((resolve) => {
			resolver = resolve;
		});
		socket.on('connect_error', (error) => {
			expect(error).toBeTruthy();
			resolver(true);
		});

		await promise;

		expect(socket.connected).toBeFalsy();
	});

	it("Can't connect with an invalid handshake token", async () => {
		const socket = pendingTestWebSocket('', username);

		let resolver: (valud: boolean) => void;
		const promise = new Promise((resolve) => {
			resolver = resolve;
		});
		socket.on('connect_error', (error) => {
			expect(error).toBeTruthy();
			resolver(true);
		});

		await promise;

		expect(socket.connected).toBeFalsy();
	});

	it("Can't connect with an invalid handshake username", async () => {
		const socket = pendingTestWebSocket(nanoid(), '');

		let resolver: (valud: boolean) => void;
		const promise = new Promise((resolve) => {
			resolver = resolve;
		});
		socket.on('connect_error', (error) => {
			expect(error).toBeTruthy();
			resolver(true);
		});

		await promise;

		expect(socket.connected).toBeFalsy();
	});
});
