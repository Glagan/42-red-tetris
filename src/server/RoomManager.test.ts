import { nanoid } from 'nanoid';
import Player from './lib/Player';
import Room from './lib/Room';
import RoomManager from './RoomManager';

describe('RoomManager', () => {
	const room = new Room('My room');

	it('Is empty by default', () => {
		expect(RoomManager.all()).toEqual([]);
	});

	it('Can add a room', () => {
		RoomManager.addRoom(room);
		expect(RoomManager.rooms.length).toEqual(1);
		const insertedRoom = RoomManager.rooms[0];
		expect(room.name).toEqual(insertedRoom.name);
	});

	it('Can get a room', () => {
		expect(RoomManager.getRoom(room.id)).toEqual(room);
		expect(RoomManager.getRoom(room)).toEqual(room);
		expect(RoomManager.getRoom(nanoid())).toBe(undefined);
	});

	it('Has updated list of all rooms', () => {
		const rooms = RoomManager.all();
		expect(rooms.length).toEqual(1);
		expect(rooms).toEqual([room.toClient()]);
	});

	it('Can remove a room', () => {
		expect(RoomManager.rooms.length).toEqual(1);
		RoomManager.removeRoom(nanoid());
		expect(RoomManager.rooms.length).toEqual(1);
		RoomManager.removeRoom(room.id);
		expect(RoomManager.rooms.length).toEqual(0);
	});

	it("Removing a room remove it's players", () => {
		const room = new Room('My room');
		const player = new Player('Player');

		RoomManager.addRoom(room);
		player.joinRoom(room);
		expect(room.players.length).toBe(1);
		expect(RoomManager.rooms.length).toEqual(1);
		expect(player.room).toBeTruthy();

		RoomManager.removeRoom(room.id);
		expect(room.players.length).toBe(0);
		expect(RoomManager.rooms.length).toEqual(0);
		expect(player.room).toBeFalsy();
	});

	it("A playing room can't be removed", () => {
		const room = new Room('My room');
		const player = new Player('Player');

		RoomManager.addRoom(room);
		player.joinRoom(room);
		room.togglePlayerAsReady(player.id);
		room.createGame();
		expect(room.game).toBeTruthy();
		expect(RoomManager.rooms.length).toEqual(1);

		RoomManager.removeRoom(room.id);
		expect(room.game).toBeTruthy();
		expect(RoomManager.rooms.length).toEqual(1);

		// ! Cleanup before a real game starts
		delete room.game;
		RoomManager.removeRoom(room.id);
		expect(room.game).toBeFalsy();
		expect(RoomManager.rooms.length).toEqual(0);
	});

	it('Can add and remove a player from matchmaking', () => {
		const player = new Player('Player');

		expect(RoomManager.matchmaking.length).toBe(0);
		expect(RoomManager.playerIsInMatchmaking(player.id)).toBeFalsy();
		expect(RoomManager.removePlayerFromMatchmaking(player.id)).toBeFalsy();

		RoomManager.addPlayerToMatchmaking(player);
		expect(RoomManager.matchmaking.length).toBe(1);
		expect(RoomManager.playerIsInMatchmaking(player.id)).toBeTruthy();

		expect(RoomManager.removePlayerFromMatchmaking(player.id)).toBeTruthy();
		expect(RoomManager.matchmaking.length).toBe(0);
		expect(RoomManager.playerIsInMatchmaking(player.id)).toBeFalsy();
	});

	it('Can find an opponent with Matchmaking', () => {
		const playerOne = new Player('Player 1');
		const playerTwo = new Player('Player 2');

		RoomManager.addPlayerToMatchmaking(playerOne);
		RoomManager.addPlayerToMatchmaking(playerTwo);

		expect(RoomManager.findOpponent(playerOne.id)).toBe(playerTwo);
		expect(RoomManager.findOpponent(playerTwo.id)).toBe(playerOne);
		expect(RoomManager.findOpponent(nanoid())).toBe(playerOne);
	});
});
