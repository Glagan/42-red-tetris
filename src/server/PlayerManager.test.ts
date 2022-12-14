import { getRandomInt } from '$utils/random';
import {
	cleanupWebSocketTestServer,
	connectTestWebSocket,
	setupWebSocketTestServer
} from '$utils/test';
import { nanoid } from 'nanoid';
import type { TypedSocket } from 'src/socket';
import Room from './lib/Room';
import PlayerManager from './PlayerManager';
import RoomManager from './RoomManager';

describe('Player Manager', () => {
	const socket = nanoid();
	const token = nanoid();
	const username = `Player#${getRandomInt(1000, 9999)}`;

	beforeAll(async () => {
		setupWebSocketTestServer();
	});

	afterAll(() => {
		cleanupWebSocketTestServer();
	});

	it('Is empty by default', () => {
		expect(PlayerManager.players).toEqual({});
	});

	it('Can add a player', () => {
		PlayerManager.add(token, 'Player');
		expect(Object.keys(PlayerManager.players).length).toEqual(1);

		const createdPlayer = PlayerManager.players[token];
		expect(createdPlayer).toBeTruthy();
		expect(createdPlayer.name).toEqual('Player');
	});

	it('Can check if a player exists', () => {
		expect(PlayerManager.exists(token)).toBeTruthy();
		expect(PlayerManager.exists(nanoid())).toBeFalsy();
	});

	it('Can get an existing player', () => {
		const player = PlayerManager.get(token);
		expect(player).toBeTruthy();
		expect(player.name).toEqual('Player');
	});

	it("Doesn't find players that don't exist", () => {
		const player = PlayerManager.get(nanoid());
		expect(player).toBeFalsy();
	});

	it('Can remove socket', () => {
		expect(PlayerManager.exists(token)).toBeTruthy();
		expect(PlayerManager.exists(socket)).toBeFalsy();
	});

	it('Can cleanup players', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		PlayerManager.add(token, 'Player');
		PlayerManager.players[token].socket = socket as unknown as TypedSocket;
		expect(PlayerManager.exists(token)).toBeTruthy();
		PlayerManager.cleanup();
		expect(PlayerManager.exists(token)).toBeTruthy();

		PlayerManager.players[token].socket = undefined;
		PlayerManager.cleanup();
		expect(PlayerManager.exists(token)).toBeFalsy();

		// Cleanup
		socket.disconnect();
	});

	it('Players cleanup delete rooms', async () => {
		const token = nanoid();
		const socket = await connectTestWebSocket(token, username);

		PlayerManager.add(token, 'Player');
		const player = PlayerManager.get(token);
		PlayerManager.players[token].socket = socket as unknown as TypedSocket;
		const room = new Room('My room');
		player.joinRoom(room);
		RoomManager.addRoom(room);
		expect(PlayerManager.exists(token)).toBeTruthy();
		expect(RoomManager.getRoom(room.id)).toBeTruthy();
		PlayerManager.cleanup();
		expect(PlayerManager.exists(token)).toBeTruthy();
		expect(RoomManager.getRoom(room.id)).toBeTruthy();

		PlayerManager.players[token].socket = undefined;
		PlayerManager.cleanup();
		expect(PlayerManager.exists(token)).toBeFalsy();
		expect(RoomManager.getRoom(room.id)).toBeFalsy();

		// Cleanup
		socket.disconnect();
	});

	it('Players cleanup do not delete non-empty rooms', () => {
		const tokenOne = nanoid();
		const tokenTwo = nanoid();

		PlayerManager.add(tokenOne, 'Player 1');
		PlayerManager.add(tokenTwo, 'Player 2');
		const playerOne = PlayerManager.get(tokenOne);
		const playerTwo = PlayerManager.get(tokenTwo);
		// @ts-expect-error We only need to have a truthy value here
		PlayerManager.players[tokenOne].socket = true;
		const room = new Room('My room');
		playerOne.joinRoom(room);
		playerTwo.joinRoom(room);
		RoomManager.addRoom(room);

		expect(PlayerManager.exists(tokenOne)).toBeTruthy();
		expect(PlayerManager.exists(tokenTwo)).toBeTruthy();
		expect(RoomManager.getRoom(room.id)).toBeTruthy();

		PlayerManager.cleanup();
		expect(PlayerManager.exists(tokenOne)).toBeTruthy();
		expect(PlayerManager.exists(tokenTwo)).toBeFalsy();
		expect(RoomManager.getRoom(room.id)).toBeTruthy();
	});
});
