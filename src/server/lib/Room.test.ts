import { cleanupWebSocketTestServer, setupWebSocketTestServer } from '$utils/test';
import { nanoid } from 'nanoid';
import Game from './Game';
import Player from './Player';
import Room from './Room';

describe('Room', () => {
	beforeAll(async () => {
		setupWebSocketTestServer();
	});

	afterAll(() => {
		cleanupWebSocketTestServer();
	});

	it('Can create a room', () => {
		const room = new Room('Room');
		expect(room).toBeInstanceOf(Room);
		expect(room.name).toBe('Room');
		expect(room.id.length).toBe(21);
		expect(room.players.length).toBe(0);
		expect(room.ready.length).toBe(0);
		expect(room.game).toBeUndefined();
		expect(room.winner).toBe(-1);
		expect(room.playersIndex).toStrictEqual({});
	});

	it('Can add a player', () => {
		const room = new Room('Room');
		const player = new Player('Player');

		expect(room.players.length).toBe(0);

		room.addPlayer(player);
		expect(room.players.length).toBe(1);
		expect(room.players[0]).toBe(player);
		expect(room.ready.length).toBe(0);
		expect(room.game).toBeUndefined();
		expect(room.winner).toBe(-1);
		expect(room.playersIndex).toStrictEqual({});
	});

	it("Can't add a player twice", () => {
		const room = new Room('Room');
		const player = new Player('Player');

		expect(room.players.length).toBe(0);

		room.addPlayer(player);
		expect(room.players.length).toBe(1);
		expect(room.players[0]).toBe(player);

		room.addPlayer(player);
		expect(room.players.length).toBe(1);
		expect(room.players[0]).toBe(player);
	});

	it('Can remove a player', () => {
		const room = new Room('Room');
		const player = new Player('Player');

		expect(room.players.length).toBe(0);

		room.addPlayer(player);
		expect(room.players.length).toBe(1);
		expect(room.ready.length).toBe(0);

		room.removePlayer(player.id);
		expect(room.players.length).toBe(0);
		expect(room.ready.length).toBe(0);

		room.addPlayer(player);
		room.togglePlayerAsReady(player.id);
		expect(room.players.length).toBe(1);
		expect(room.ready.length).toBe(1);

		room.removePlayer(player.id);
		expect(room.players.length).toBe(0);
		expect(room.ready.length).toBe(0);
	});

	it('Can remove a player marked as ready', () => {
		const room = new Room('Room');
		const player = new Player('Player');

		expect(room.players.length).toBe(0);

		room.addPlayer(player);
		room.togglePlayerAsReady(player.id);
		expect(room.players.length).toBe(1);
		expect(room.ready.length).toBe(1);

		room.removePlayer(player.id);
		expect(room.players.length).toBe(0);
		expect(room.ready.length).toBe(0);
	});

	it('Reset ready status when a player leave the room', () => {
		const room = new Room('Room');
		const playerOne = new Player('Player');
		const playerTwo = new Player('Player');

		expect(room.players.length).toBe(0);

		room.addPlayer(playerOne);
		room.addPlayer(playerTwo);
		room.togglePlayerAsReady(playerOne.id);
		room.togglePlayerAsReady(playerTwo.id);
		expect(room.players.length).toBe(2);
		expect(room.ready.length).toBe(2);

		room.removePlayer(playerTwo.id);
		expect(room.players.length).toBe(1);
		expect(room.ready.length).toBe(0);
	});

	it('Can unready a player', () => {
		const room = new Room('Room');
		const playerOne = new Player('Player');
		const playerTwo = new Player('Player');

		expect(room.players.length).toBe(0);

		room.addPlayer(playerOne);
		expect(room.players.length).toBe(1);
		expect(room.ready.length).toBe(0);

		room.togglePlayerAsReady(playerOne.id);
		expect(room.players.length).toBe(1);
		expect(room.ready.length).toBe(1);

		room.unreadyPlayer(nanoid());
		expect(room.players.length).toBe(1);
		expect(room.ready.length).toBe(1);

		room.unreadyPlayer(playerOne.id);
		expect(room.players.length).toBe(1);
		expect(room.ready.length).toBe(0);

		room.addPlayer(playerTwo);
		room.togglePlayerAsReady(playerTwo.id);
		room.togglePlayerAsReady(playerOne.id);
		expect(room.players.length).toBe(2);
		expect(room.ready.length).toBe(2);

		room.unreadyPlayer(playerTwo.id);
		expect(room.players.length).toBe(2);
		expect(room.ready.length).toBe(1);

		room.unreadyPlayer(playerOne.id);
		expect(room.players.length).toBe(2);
		expect(room.ready.length).toBe(0);
	});

	it('Can detect a full room', () => {
		const room = new Room('Room');
		const playerOne = new Player('Player 1');
		const playerTwo = new Player('Player 2');

		expect(room.players.length).toBe(0);
		expect(room.isFull()).toBeFalsy();

		room.addPlayer(playerOne);
		expect(room.players.length).toBe(1);
		expect(room.ready.length).toBe(0);
		expect(room.isFull()).toBeFalsy();

		room.addPlayer(playerTwo);
		expect(room.players.length).toBe(2);
		expect(room.ready.length).toBe(0);
		expect(room.isFull()).toBeTruthy();
	});

	it('Can detect an empty room', () => {
		const room = new Room('Room');
		const playerOne = new Player('Player 1');
		const playerTwo = new Player('Player 2');

		expect(room.players.length).toBe(0);
		expect(room.isEmpty()).toBeTruthy();

		room.addPlayer(playerOne);
		expect(room.ready.length).toBe(0);
		expect(room.isEmpty()).toBeFalsy();

		room.addPlayer(playerTwo);
		expect(room.ready.length).toBe(0);
		expect(room.isEmpty()).toBeFalsy();
	});

	it('Can toggle a player ready state', () => {
		const room = new Room('Room');
		const playerOne = new Player('Player 1');
		const playerTwo = new Player('Player 2');

		room.addPlayer(playerOne);
		room.addPlayer(playerTwo);
		expect(room.players.length).toBe(2);
		expect(room.ready.length).toBe(0);

		room.togglePlayerAsReady(playerOne.id);
		expect(room.ready.length).toBe(1);
		room.togglePlayerAsReady(playerOne.id);
		expect(room.ready.length).toBe(0);
		room.togglePlayerAsReady(playerOne.id);

		room.togglePlayerAsReady(nanoid());
		expect(room.ready.length).toBe(1);

		room.togglePlayerAsReady(playerTwo.id);
		expect(room.ready.length).toBe(2);
		room.togglePlayerAsReady(playerOne.id);
		expect(room.ready.length).toBe(1);
		room.togglePlayerAsReady(playerTwo.id);
		expect(room.ready.length).toBe(0);
	});

	it('Can detect if all players are ready', () => {
		const room = new Room('Room');
		const playerOne = new Player('Player 1');
		const playerTwo = new Player('Player 2');

		expect(room.allPlayersReady()).toBeFalsy();

		room.addPlayer(playerOne);
		room.addPlayer(playerTwo);
		expect(room.allPlayersReady()).toBeFalsy();

		room.togglePlayerAsReady(playerOne.id);
		expect(room.allPlayersReady()).toBeFalsy();
		room.togglePlayerAsReady(playerTwo.id);
		expect(room.allPlayersReady()).toBeTruthy();

		room.togglePlayerAsReady(playerOne.id);
		expect(room.allPlayersReady()).toBeFalsy();
		room.togglePlayerAsReady(playerTwo.id);
		expect(room.allPlayersReady()).toBeFalsy();
	});

	it('Can create a game for the room', () => {
		const room = new Room('Room');
		const playerOne = new Player('Player 1');
		const playerTwo = new Player('Player 2');

		room.createGame();
		expect(room.game).toBeUndefined();
		expect(room.winner).toBe(-1);
		expect(room.playersIndex).toStrictEqual({});

		room.addPlayer(playerOne);
		room.togglePlayerAsReady(playerOne.id);
		room.addPlayer(playerTwo);
		room.togglePlayerAsReady(playerTwo.id);

		expect(room.game).toBeUndefined();
		expect(room.winner).toBe(-1);
		expect(room.playersIndex).toStrictEqual({});

		room.createGame();
		const game = room.game;
		// ! Delete the game directly to avoid it running in the background
		delete room.game;
		expect(game).toBeInstanceOf(Game);
		expect(game?.room).toBe(`room:${room.id}`);
		expect(game?.playerCount).toBe(2);
		expect(game?.paused).toBeTruthy();
		expect(room.winner).toBe(-1);
		expect(room.ready.length).toBe(0);
		expect(room.playersIndex).toStrictEqual({
			[playerOne.id]: 0,
			[playerTwo.id]: 1
		});
	});

	it("Can start/stop a game and check if it's running", () => {
		const room = new Room('Room');
		const player = new Player('Player 1');

		expect(room.isPlaying()).toBeFalsy();

		room.addPlayer(player);
		room.togglePlayerAsReady(player.id);
		room.createGame();
		expect(room.isPlaying()).toBeTruthy();
		room.startGame(); // Directly start the game
		expect(room.isPlaying()).toBeTruthy();
		expect(room.game?.paused).toBeFalsy();

		room.stopGame();
		expect(room.isPlaying()).toBeTruthy();
		room.pauseGame();
		expect(room.isPlaying()).toBeTruthy();
		room.game?.gameOver(0);
		expect(room.isPlaying()).toBeFalsy();
	});

	it('Can kick the second player', () => {
		const room = new Room('Room');
		const playerOne = new Player('Player 1');
		const playerTwo = new Player('Player 2');

		expect(room.kickSecondPlayer()).toBeUndefined();
		expect(room.players.length).toBe(0);
		playerOne.joinRoom(room);
		expect(room.kickSecondPlayer()).toBeUndefined();
		expect(room.players.length).toBe(1);
		playerTwo.joinRoom(room);
		expect(room.kickSecondPlayer()).toBe(playerTwo);
		expect(room.players.length).toBe(1);
		expect(room.kickSecondPlayer()).toBeUndefined();
		expect(room.players.length).toBe(1);

		playerTwo.joinRoom(room);
		room.togglePlayerAsReady(playerOne.id);
		room.togglePlayerAsReady(playerTwo.id);
		expect(room.kickSecondPlayer()).toBe(playerTwo);
		expect(room.ready.length).toBe(0);
		expect(room.players.length).toBe(1);
	});

	it('Correctly translate to a client object', () => {
		const room = new Room('Room');

		let roomForClient = room.toClient();
		expect(roomForClient.id).toBe(room.id);
		expect(roomForClient.name).toBe(room.name);
		expect(roomForClient.players.length).toBe(0);

		const player = new Player('Player');
		player.joinRoom(room);

		roomForClient = room.toClient();
		expect(roomForClient.id).toBe(room.id);
		expect(roomForClient.name).toBe(room.name);
		expect(roomForClient.players.length).toBe(1);
		expect(roomForClient.players[0]).toStrictEqual(player.toClient());
		// @ts-expect-error Check if the socket doesn't leak in the client object
		expect(roomForClient.players[0].socket).toBeUndefined();
	});
});
