import { cleanupWebSocketTestServer, setupWebSocketTestServer } from '$utils/test';
import Player from './Player';
import Room from './Room';

describe('Test Player', () => {
	beforeAll(async () => {
		setupWebSocketTestServer();
	});

	afterAll(() => {
		cleanupWebSocketTestServer();
	});

	it('Can create a player', () => {
		const player = new Player('Player');
		expect(player).toBeInstanceOf(Player);
		expect(player.name).toBe('Player');
		expect(player.id.length).toBe(21);
		expect(player.room).toBeUndefined();
		expect(player.socket).toBeUndefined();
	});

	it('Can join a Room', () => {
		const player = new Player('Player');
		const room = new Room('Room');

		player.joinRoom(room);
		expect(player.room).toBe(room);
		expect(room.players.length).toBe(1);
	});

	it('Can leave a Room', () => {
		const player = new Player('Player');
		const room = new Room('Room');

		expect(player.leaveCurrentRoom()).toBeUndefined();

		player.joinRoom(room);
		expect(player.room).toBeTruthy();
		expect(player.leaveCurrentRoom()).toBe(room);
		expect(player.room).toBeUndefined();

		expect(room.players.length).toBe(0);
	});

	it('Correctly translate to a client object', () => {
		const player = new Player('Player');

		let playerForClient = player.toClient();
		expect(playerForClient.id).toBe(player.id);
		expect(playerForClient.name).toBe(player.name);
		expect(playerForClient.room).toBeUndefined();
		expect(playerForClient.status).toBeFalsy();
		// @ts-expect-error Check if the socket doesn't leak in the client object
		expect(playerForClient.socket).toBeUndefined();

		const room = new Room('Room');
		player.joinRoom(room);

		playerForClient = player.toClient();
		expect(playerForClient.id).toBe(player.id);
		expect(playerForClient.name).toBe(player.name);
		expect(playerForClient.room).toBe(room.id);
		expect(playerForClient.status).toBeFalsy();
		// @ts-expect-error Check if the socket doesn't leak in the client object
		expect(playerForClient.socket).toBeUndefined();
	});
});
