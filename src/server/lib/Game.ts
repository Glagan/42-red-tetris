// @ts-expect-error Huh ? File '.../node_modules/accurate-game-loop/index.ts' is not a module. ts(2306)
import { default as Loop } from 'accurate-game-loop';
import Board, { MoveDirection, RotationDirection } from './Board';
import { TetrominoType } from '$shared/Tetromino';
import type Tetromino from './Tetrominoes/Tetromino';
import TetrominoI from './Tetrominoes/TetrominoI';
import TetrominoJ from './Tetrominoes/TetrominoJ';
import TetrominoL from './Tetrominoes/TetrominoL';
import TetrominoO from './Tetrominoes/TetrominoO';
import TetrominoS from './Tetrominoes/TetrominoS';
import TetrominoT from './Tetrominoes/TetrominoT';
import TetrominoZ from './Tetrominoes/TetrominoZ';
import { getRandomInt } from '$utils/random';
import { ioServer } from './SocketIO';

const TICK_RATE = 60;
const GRAVITY_PER_SEC = 0.5;

export default class Game {
	// socket.io room to emit events to
	room: string;
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

	constructor(room: string, playerCount: number) {
		this.room = room;
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

	emitBoardUpdate(index: number) {
		ioServer.to(this.room).emit('game:board', {
			player: index,
			board: this.boards[index].bitboard
		});
	}

	emitPieceUpdate(index: number) {
		if (this.boards[index].movingTetromino) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const tetromino = this.boards[index].movingTetromino!;
			ioServer.to(this.room).emit('game:piece', {
				player: index,
				x: tetromino.offset[0],
				y: tetromino.offset[1],
				type: tetromino.type,
				matrix: tetromino.matrix
			});
		}
	}

	start() {
		this.paused = false;
		this.loop.start();
	}

	move(index: number, direction: MoveDirection) {
		const ok = this.boards[index].move(direction);
		if (ok) {
			this.emitPieceUpdate(index);
		}
		return ok;
	}

	rotate(index: number, direction: RotationDirection) {
		const ok = this.boards[index].rotateWithWallKicks(direction);
		if (ok) {
			this.emitPieceUpdate(index);
		}
		return ok;
	}

	dash(index: number) {
		const ok = this.boards[index].dash();
		if (ok) {
			this.spawnNextTetromino(index);
			return ok;
		}
		return false;
	}

	gameOver(loserBoardIndex: number) {
		this.emitBoardUpdate(loserBoardIndex);
		this.stop();
		if (this.playerCount == 1) {
			this.winner = 0;
		} else {
			this.winner = (loserBoardIndex + 1) % 2;
		}
		ioServer.to(this.room).emit('game:over', this.winner);
		console.log('loser');
		console.log(this.boards[loserBoardIndex].repr());
		this.onCompletion?.(this.winner);
	}

	/**
	 * Spawn the next tetromino for the given board and return true if the board can't handle a new tetromino
	 * @param boardIndex
	 * @returns false if the game is over or true
	 */
	spawnNextTetromino(boardIndex: number) {
		this.addRandomTetrominoToBags();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const nextTetromino = this.tetrominoesBags[boardIndex].pop()!;
		if (this.boards[boardIndex].spawnTetromino(nextTetromino)) {
			this.emitBoardUpdate(boardIndex);
			this.emitPieceUpdate(boardIndex);
			return true;
		}
		this.gameOver(boardIndex);
		return false;
	}

	/**
	 * Run every ~16.6667ms
	 */
	async onTick(/* deltaMs: number */) {
		// console.log('tick', deltaMs, this.tick, this.nextTickDown);
		// ioServer.to(this.room).emit('game:tick', this.tick + 1);
		if (this.tick >= this.nextTickDown) {
			for (let index = 0; index < this.playerCount; index++) {
				const completedLines = this.boards[index].tickDown();
				if (completedLines >= 0 && !this.spawnNextTetromino(index)) {
					return;
				}
				// Add blocked lines to the other player
				if (this.playerCount > 1 && completedLines >= 2) {
					for (let otherIndex = 0; otherIndex < this.playerCount; otherIndex++) {
						if (
							otherIndex != index &&
							!this.boards[otherIndex].generateBlockedLine(completedLines - 1)
						) {
							this.gameOver(otherIndex);
							return;
						}
						this.emitBoardUpdate(otherIndex);
						this.emitPieceUpdate(otherIndex);
					}
				}
				console.log(this.boards[index].repr());
			}
			this.nextTickDown = this.tick + this.tickDownRate;
		}
		this.tick += 1;
		return false;
	}

	stop() {
		this.paused = true;
		this.loop.stop();
	}

	pause() {
		this.stop();
	}
}
