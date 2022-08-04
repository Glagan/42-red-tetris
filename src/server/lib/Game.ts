import Board from './Board';
import { TetrominoType } from './Tetrominoes/Tetromino';
import type Tetromino from './Tetrominoes/Tetromino';
import TetrominoI from './Tetrominoes/TetrominoI';
import TetrominoJ from './Tetrominoes/TetrominoJ';
import TetrominoL from './Tetrominoes/TetrominoL';
import TetrominoO from './Tetrominoes/TetrominoO';
import TetrominoS from './Tetrominoes/TetrominoS';
import TetrominoT from './Tetrominoes/TetrominoT';
import TetrominoZ from './Tetrominoes/TetrominoZ';
// @ts-expect-error Huh ? File '.../node_modules/accurate-game-loop/index.ts' is not a module. ts(2306)
import { default as Loop } from 'accurate-game-loop';

const TICK_RATE = 60;
const GRAVITY_PER_SEC = 0.5;

export enum Winner {
	None,
	PlayerOne,
	PlayerTwo
}

// @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export default class Game {
	winner: Winner;
	boards: [Board, Board];
	lastTetromino?: TetrominoType;
	tetrominoesBags: [Tetromino[], Tetromino[]];
	paused: boolean;
	loop: Loop.Loop;
	tick: number;
	tickDownRate: number;
	nextTickDown: number;

	constructor() {
		this.winner = Winner.None;
		this.boards = [new Board(), new Board()];
		// Always keep 3 next tetrominoes
		// -- +1 at the start for the initial tetromino
		this.tetrominoesBags = [[], []];
		for (let i = 0; i < 4; i++) {
			this.addRandomTetrominoToBags();
		}
		// Add the initial tetrominoes to the boards
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.boards[0].spawnTetromino(this.tetrominoesBags[0].pop()!);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.boards[1].spawnTetromino(this.tetrominoesBags[1].pop()!);
		this.paused = true;
		this.tick = 0;
		this.tickDownRate = Math.floor(1000 / GRAVITY_PER_SEC / TICK_RATE);
		this.nextTickDown = this.tickDownRate;
		this.loop = new Loop(this.onTick.bind(this), TICK_RATE);
	}

	generateTetromino(type: TetrominoType): Tetromino {
		switch (type) {
			case TetrominoType.I:
				return new TetrominoI();
			case TetrominoType.J:
				return new TetrominoJ();
			case TetrominoType.L:
				return new TetrominoL();
			case TetrominoType.O:
				return new TetrominoO();
			case TetrominoType.S:
				return new TetrominoS();
			case TetrominoType.T:
				return new TetrominoT();
			case TetrominoType.Z:
				return new TetrominoZ();
		}
		throw new Error('Failed to generate Tetromino');
	}

	/**
	 * Random tetromino.
	 * Reroll only once if the tetromino is the same as the last one.
	 * @returns A Tetromino type
	 */
	randomTetrominoType() {
		const type = getRandomInt(1, 8);
		if (type === this.lastTetromino) {
			const reroll = getRandomInt(1, 8);
			this.lastTetromino = reroll;
			return reroll;
		}
		this.lastTetromino = type;
		return type;
	}

	addRandomTetrominoToBags() {
		const type = this.randomTetrominoType();

		const playerOneTetromino = this.generateTetromino(type);
		Board.moveTetrominoToCenter(playerOneTetromino);
		this.tetrominoesBags[0].unshift(playerOneTetromino);

		const playerTwoTetromino = this.generateTetromino(type);
		Board.moveTetrominoToCenter(playerTwoTetromino);
		this.tetrominoesBags[1].unshift(playerTwoTetromino);
	}

	start() {
		this.paused = false;
		this.loop.start();
	}

	/**
	 * Run every ~16.6667ms
	 */
	async onTick(deltaMs: number) {
		console.log('tick', deltaMs, this.tick, this.nextTickDown);
		if (this.tick >= this.nextTickDown) {
			if (this.boards[0].tickDown()) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const nextTetromino = this.tetrominoesBags[0].pop()!;
				if (this.boards[0].canSpawnTetromino(nextTetromino)) {
					this.boards[0].spawnTetromino(nextTetromino);
					this.addRandomTetrominoToBags();
				} else {
					this.winner = Winner.PlayerTwo;
					this.stop();
				}
			}
			if (this.boards[1].tickDown()) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const nextTetromino = this.tetrominoesBags[1].pop()!;
				if (this.boards[1].canSpawnTetromino(nextTetromino)) {
					this.boards[1].spawnTetromino(nextTetromino);
					this.addRandomTetrominoToBags();
				} else {
					this.winner = Winner.PlayerOne;
					this.stop();
				}
			}
			this.nextTickDown = this.tick + this.tickDownRate;
			console.log(this.boards[0].repr());
		}
		this.tick += 1;
	}

	stop() {
		this.paused = true;
		this.loop.stop();
	}

	pause() {
		this.stop();
	}
}
