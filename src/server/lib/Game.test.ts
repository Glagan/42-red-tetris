import Board from './Board';
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
});
