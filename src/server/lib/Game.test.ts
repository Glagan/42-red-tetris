import Board, { COLUMNS, MoveDirection, RotationDirection, ROWS } from './Board';
import Game from './Game';
import { TetrominoType } from '$shared/Tetromino';
import TetrominoI from './Tetrominoes/TetrominoI';
import TetrominoJ from './Tetrominoes/TetrominoJ';
import TetrominoL from './Tetrominoes/TetrominoL';
import TetrominoO from './Tetrominoes/TetrominoO';
import TetrominoS from './Tetrominoes/TetrominoS';
import TetrominoT from './Tetrominoes/TetrominoT';
import TetrominoZ from './Tetrominoes/TetrominoZ';

describe('Test Game', () => {
	const game = new Game('room:test', 2);

	it('Has a valid default state', () => {
		expect(game.winner).toBe(0);
		expect(game.boards.length).toBe(2);
		expect(game.boards[0]).toBeInstanceOf(Board);
		expect(game.boards[1]).toBeInstanceOf(Board);
		expect(game.tetrominoesBags.length).toBe(2);
		expect(game.tetrominoesBags[0].length).toBe(3);
		expect(game.tetrominoesBags[1].length).toBe(3);
		expect(game.paused).toBeTruthy();
		expect(game.tick).toBe(0);
		expect(game.nextTickDown).toBe(game.tickDownRate);
		expect(game.loop._running).toBeFalsy();
	});

	it('Can generate tetrominoes', () => {
		expect(game.generateTetromino(TetrominoType.I)).toBeInstanceOf(TetrominoI);
		expect(game.generateTetromino(TetrominoType.J)).toBeInstanceOf(TetrominoJ);
		expect(game.generateTetromino(TetrominoType.L)).toBeInstanceOf(TetrominoL);
		expect(game.generateTetromino(TetrominoType.O)).toBeInstanceOf(TetrominoO);
		expect(game.generateTetromino(TetrominoType.S)).toBeInstanceOf(TetrominoS);
		expect(game.generateTetromino(TetrominoType.T)).toBeInstanceOf(TetrominoT);
		expect(game.generateTetromino(TetrominoType.Z)).toBeInstanceOf(TetrominoZ);
		expect(game.generateTetromino.bind(game, TetrominoType.None)).toThrowError();
	});

	it('Can generate random tetrominoes', () => {
		for (let index = 0; index < 100; index++) {
			const tetromino = game.randomTetrominoType();
			expect(tetromino).toBeGreaterThanOrEqual(1);
			expect(tetromino).toBeLessThanOrEqual(7);
			expect(game.lastTetromino).toBe(tetromino);
		}
	});

	it('Can add tetrominoes to bags', () => {
		const previousLengths = [game.tetrominoesBags[0].length, game.tetrominoesBags[1].length];
		const previousFirst = [game.tetrominoesBags[0][0], game.tetrominoesBags[1][0]];

		game.addRandomTetrominoToBags();
		expect(game.tetrominoesBags[0].length).toBe(previousLengths[0] + 1);
		expect(game.tetrominoesBags[1].length).toBe(previousLengths[1] + 1);
		expect(game.tetrominoesBags[0][0] != previousFirst[0]).toBeTruthy();
		expect(game.tetrominoesBags[1][0] != previousFirst[1]).toBeTruthy();
	});

	it('Has a valid game loop', () => {
		expect(game.tick).toBe(0);
		game.onTick();
		expect(game.tick).toBe(1);

		game.tick = game.tickDownRate + 1;
		game.onTick();
		expect(game.tick).toBe(game.tickDownRate + 2);
		expect(game.nextTickDown).toBe(game.tick + game.tickDownRate - 1);
	});

	it('Can start and stop/pause', () => {
		expect(game.paused).toBeTruthy();
		expect(game.loop._running).toBeFalsy();
		game.start();
		expect(game.paused).toBeFalsy();
		expect(game.loop._running).toBeTruthy();
		game.pause();
		expect(game.paused).toBeTruthy();
		expect(game.loop._running).toBeFalsy();
		game.start();
		expect(game.paused).toBeFalsy();
		expect(game.loop._running).toBeTruthy();
		game.stop();
		expect(game.paused).toBeTruthy();
		expect(game.loop._running).toBeFalsy();
	});

	it('Can call move action on a board', () => {
		const game = new Game('room:test', 1);

		expect(game.move(0, MoveDirection.Left)).toBeTruthy();
		expect(game.move(0, MoveDirection.Right)).toBeTruthy();
	});

	it('Can call rotate action on a board', () => {
		const game = new Game('room:test', 1);

		expect(game.rotate(0, RotationDirection.Clockwise)).toBeTruthy();
		expect(game.rotate(0, RotationDirection.Clockwise)).toBeTruthy();
		expect(game.rotate(0, RotationDirection.Clockwise)).toBeTruthy();
		expect(game.rotate(0, RotationDirection.Clockwise)).toBeTruthy();
		expect(game.rotate(0, RotationDirection.CounterClockwise)).toBeTruthy();
		expect(game.rotate(0, RotationDirection.CounterClockwise)).toBeTruthy();
		expect(game.rotate(0, RotationDirection.CounterClockwise)).toBeTruthy();
		expect(game.rotate(0, RotationDirection.CounterClockwise)).toBeTruthy();

		game.boards[0].movingTetromino = undefined;
		expect(game.rotate(0, RotationDirection.Clockwise)).toBeFalsy();
		expect(game.rotate(0, RotationDirection.Clockwise)).toBeFalsy();
		expect(game.rotate(0, RotationDirection.Clockwise)).toBeFalsy();
		expect(game.rotate(0, RotationDirection.Clockwise)).toBeFalsy();
		expect(game.rotate(0, RotationDirection.CounterClockwise)).toBeFalsy();
		expect(game.rotate(0, RotationDirection.CounterClockwise)).toBeFalsy();
		expect(game.rotate(0, RotationDirection.CounterClockwise)).toBeFalsy();
		expect(game.rotate(0, RotationDirection.CounterClockwise)).toBeFalsy();
	});

	it('Can call dash action on a board', () => {
		const game = new Game('room:test', 1);

		expect(game.dash(0)).toBeTruthy();

		game.boards[0].movingTetromino = undefined;
		expect(game.dash(0)).toBeFalsy();
	});

	it('Can finish a game', () => {
		let game = new Game('room:test', 1);

		game.gameOver(0);
		expect(game.winner).toBe(0);
		expect(game.paused).toBeTruthy();
		expect(game.loop._running).toBeFalsy();

		game = new Game('room:test', 2);
		game.gameOver(0);
		expect(game.winner).toBe(1);
		expect(game.paused).toBeTruthy();
		expect(game.loop._running).toBeFalsy();

		game = new Game('room:test', 2);
		game.gameOver(1);
		expect(game.winner).toBe(0);
		expect(game.paused).toBeTruthy();
		expect(game.loop._running).toBeFalsy();
	});

	it('Can detect game over when trying to spawn the next tetromino', () => {
		const game = new Game('room:test', 1);

		// Fill the board so *no* tetromino can spawn
		game.boards[0].bitboard = [];
		for (let index = 0; index < ROWS; index++) {
			game.boards[0].bitboard.push(new Array(COLUMNS).fill(TetrominoType.Blocked));
		}

		expect(game.spawnNextTetromino(0)).toBeFalsy();
		expect(game.winner).toBe(0);
		expect(game.paused).toBeTruthy();
		expect(game.loop._running).toBeFalsy();
	});

	it('Correctly generate blocked lines for the enemy', async () => {
		const game = new Game('room:test', 2);

		// Generate 2 lines at the bottom of the board,
		// -- move the current tetromino so it's touching
		// -- to trigger clearAllCompletedLines in Board
		// -- and generate blocked lines for the other player in Game
		game.nextTickDown = 0;
		game.boards[0].movingTetromino = new TetrominoI();
		game.boards[0].movingTetromino.locked = true;
		game.boards[0].movingTetromino.offset = [ROWS - 2, 0];
		game.boards[0].setTetrominoOnBitboard(game.boards[0].movingTetromino);
		game.boards[0].bitboard.push(new Array(COLUMNS).fill(TetrominoType.I));
		game.boards[0].bitboard.push(new Array(COLUMNS).fill(TetrominoType.I));
		game.boards[0].bitboard.splice(0, 2);
		expect(await game.onTick()).toBeFalsy();

		expect(game.boards[1].bitboard[ROWS - 1][0]).toBe(TetrominoType.Blocked);
	});

	it('Detect failure to spawn after completing a line', async () => {
		const game = new Game('room:test', 2);

		game.boards[0].bitboard = [];
		for (let index = 0; index < ROWS; index++) {
			game.boards[0].bitboard.push(new Array(COLUMNS).fill(TetrominoType.Blocked));
			game.boards[0].bitboard[index][0] = TetrominoType.None;
		}
		game.boards[0].movingTetromino = new TetrominoI();
		game.boards[0].movingTetromino.locked = true;
		game.nextTickDown = 0;
		expect(await game.onTick()).toBeTruthy();
	});

	it('Detect defeating an opponent after inserting blocking lines', async () => {
		const game = new Game('room:test', 2);

		game.boards[0].bitboard = [];
		game.boards[1].bitboard = [];
		for (let index = 0; index < ROWS; index++) {
			game.boards[0].bitboard.push(new Array(COLUMNS).fill(TetrominoType.Blocked));
			game.boards[1].bitboard.push(new Array(COLUMNS).fill(TetrominoType.Blocked));
			game.boards[1].bitboard[index][0] = TetrominoType.None;
		}
		game.boards[0].movingTetromino = new TetrominoI();
		game.boards[0].movingTetromino.locked = true;
		game.nextTickDown = 0;
		expect(await game.onTick()).toBeTruthy();
	});
});
