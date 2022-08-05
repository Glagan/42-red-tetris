import { nanoid } from 'nanoid';
import PlayerManager from './PlayerManager';

describe('PlayerManager', () => {
	const socket = nanoid();
	const token = nanoid();

	it('Is empty by default', () => {
		expect(PlayerManager.players).toEqual({});
		expect(PlayerManager.playersBySocket).toEqual({});
	});

	it('Can add a player', () => {
		PlayerManager.addPlayer(socket, token, 'Player');
		expect(Object.keys(PlayerManager.players).length).toEqual(1);
		expect(Object.keys(PlayerManager.playersBySocket).length).toEqual(1);

		const createdPlayer = PlayerManager.players[token];
		expect(createdPlayer).toBeTruthy();
		expect(createdPlayer.name).toEqual('Player');

		const socketReference = PlayerManager.playersBySocket[socket];
		expect(socketReference).toEqual(token);
	});

	it('Can check if a player exists', () => {
		expect(PlayerManager.exists(token)).toBeTruthy();
		expect(PlayerManager.exists(socket)).toBeTruthy();
		expect(PlayerManager.exists(nanoid())).toBeFalsy();
	});

	it('Can get an existing player', () => {
		const player = PlayerManager.getPlayer(token);
		expect(player).toBeTruthy();
		expect(player.name).toEqual('Player');
	});

	it("Doesn't find players that don't exist", () => {
		const player = PlayerManager.getPlayer(nanoid());
		expect(player).toBeFalsy();
	});

	it('Can refresh player', () => {
		const player = PlayerManager.getPlayer(token);
		const lastUpdate = player.lastUpdate;
		PlayerManager.refreshPlayer(token);
		expect(lastUpdate.toMillis() != player.lastUpdate.toMillis()).toBeTruthy();
	});

	it('Can remove socket', () => {
		expect(PlayerManager.exists(token)).toBeTruthy();
		expect(PlayerManager.exists(socket)).toBeTruthy();
		PlayerManager.removeSocket(socket);
		expect(PlayerManager.exists(token)).toBeTruthy();
		expect(PlayerManager.exists(socket)).toBeFalsy();
	});
});
