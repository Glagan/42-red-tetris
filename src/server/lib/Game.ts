// @ts-expect-error Huh ? File '.../node_modules/accurate-game-loop/index.ts' is not a module. ts(2306)
import { default as Loop } from 'accurate-game-loop';
import Board, { MoveDirection, RotationDirection } from './Board';
import { TetrominoType } from './Tetrominoes/Tetromino';
import type Tetromino from './Tetrominoes/Tetromino';
import TetrominoI from './Tetrominoes/TetrominoI';
import TetrominoJ from './Tetrominoes/TetrominoJ';
import TetrominoL from './Tetrominoes/TetrominoL';
import TetrominoO from './Tetrominoes/TetrominoO';
import TetrominoS from './Tetrominoes/TetrominoS';
import TetrominoT from './Tetrominoes/TetrominoT';
import TetrominoZ from './Tetrominoes/TetrominoZ';
import { getRandomInt } from '$utils/random';

const TICK_RATE = 60;
const GRAVITY_PER_SEC = 0.5;

export default class Game {
	playerCount: number;
	winner: number;
	boards: Board[];
	lastTetromino?: TetrominoType;
	tetrominoesBags: Tetromino[][];
	paused: boolean;
	loop: Loop.Loop;
	tick: number;
	tickDownRate: number;
	nextTickDown: number;
	onCompletion?: (winner: number) => void;

	constructor(playerCount: number) {
		this.playerCount = playerCount;
		this.winner = 0;
		// Always keep 3 next tetrominoes
		// -- +1 at the start for the initial tetromino
		this.tetrominoesBags = [];
		this.boards = [];
		for (let index = 0; index < this.playerCount; index++) {
			this.tetrominoesBags.push([]);
			this.boards.push(new Board());
		}
		for (let i = 0; i < 4; i++) {
			this.addRandomTetrominoToBags();
		}
		// Add the initial tetrominoes to the boards
		for (let index = 0; index < this.playerCount; index++) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.boards[index].spawnTetromino(this.tetrominoesBags[index].pop()!);
		}
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

		for (let index = 0; index < this.playerCount; index++) {
			const playerTetromino = this.generateTetromino(type);
			Board.moveTetrominoToCenter(playerTetromino);
			this.tetrominoesBags[index].unshift(playerTetromino);
		}
	}

	start() {
		this.paused = false;
		this.loop.start();
	}

	move(index: number, direction: MoveDirection) {
		return this.boards[index].move(direction);
	}

	rotate(index: number, direction: RotationDirection) {
		return this.boards[index].rotateWithWallKicks(direction);
	}

	/**
	 * Run every ~16.6667ms
	 */
	async onTick(/* deltaMs: number */) {
		// console.log('tick', deltaMs, this.tick, this.nextTickDown);
		if (this.tick >= this.nextTickDown) {
			for (let index = 0; index < this.playerCount; index++) {
				if (this.boards[index].tickDown()) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					const nextTetromino = this.tetrominoesBags[index].pop()!;
					if (this.boards[index].canSpawnTetromino(nextTetromino)) {
						this.boards[index].spawnTetromino(nextTetromino);
						this.addRandomTetrominoToBags();
					} else {
						this.winner = index + 1;
						this.onCompletion?.(this.winner);
						this.stop();
					}
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
