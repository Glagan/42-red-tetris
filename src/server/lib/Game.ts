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
import WebSocket from './SocketIO';
import type GamePiece from '$client/lib/GamePiece';
import type { NextGamePiece } from '$client/lib/GamePiece';
import type GameBoard from '$client/lib/GameBoard';

const TICK_RATE = 60;

export default class Game {
	// socket.io room to emit events to
	room: string;
	playerCount: number;
	winner: number;
	boards: Board[];
	lastTetromino?: TetrominoType;
	tetrominoesBags: Tetromino[][];
	score: number[];
	paused: boolean;
	loop: Loop.Loop;
	tick: number;
	level: number;
	totalCompletedLines: number;
	tickDownRate!: number;
	nextTickDown: number;
	onCompletion?: (winner: number) => void;

	constructor(room: string, playerCount: number) {
		this.room = room;
		this.playerCount = playerCount;
		this.winner = -1;
		this.score = [];
		// Always keep 3 next tetrominoes
		// -- +1 at the start for the initial tetromino
		this.tetrominoesBags = [];
		this.boards = [];
		for (let index = 0; index < this.playerCount; index++) {
			this.score.push(0);
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
		this.level = 1;
		this.totalCompletedLines = 0;
		this.updateTickDownRate();
		this.nextTickDown = this.tickDownRate;
		this.loop = new Loop(this.onTick.bind(this), TICK_RATE);
	}

	updateTickDownRate() {
		this.tickDownRate = Math.max(1, Math.floor(1000 / TICK_RATE / (this.level / 2)));
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
			Board.translateTetrominoToCenter(playerTetromino);
			this.tetrominoesBags[index].unshift(playerTetromino);
		}
	}

	emitBoardUpdate(index: number) {
		WebSocket.server.to(this.room).emit('game:board', {
			player: index,
			score: this.score[index],
			level: this.level,
			board: this.boards[index].bitboard
		});
	}

	emitPieceUpdate(index: number) {
		if (this.boards[index].movingTetromino) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const tetromino = this.boards[index].movingTetromino!;
			WebSocket.server.to(this.room).emit('game:piece', tetromino.toClient(index));
			WebSocket.server.to(this.room).emit('game:nextPieces', index, this.nextPieces(index));
		}
	}

	globalState(index: number) {
		const state: {
			current: GamePiece | undefined;
			next: NextGamePiece[];
			board: GameBoard;
		} = {
			current: undefined,
			next: this.nextPieces(index),
			board: {
				player: index,
				score: this.score[index],
				level: this.level,
				board: this.boards[index].bitboard
			}
		};
		const tetromino = this.boards[index].movingTetromino;
		if (tetromino) {
			state.current = tetromino.toClient(index);
		}
		return state;
	}

	start() {
		this.paused = false;
		this.loop.start();
	}

	/**
	 * Return the currently active tetromino for the given player
	 * @param index
	 * @returns A tetromino if the board has one or undefined
	 */
	currentPiece(index: number) {
		return this.boards[index].movingTetromino?.toClient(index);
	}

	/**
	 * Return the next 3 tetrominoes for the given player
	 * @param index
	 * @returns An array of Tetrominoes
	 */
	nextPieces(index: number) {
		return this.tetrominoesBags[index]
			.slice(-3)
			.reverse()
			.map((tetromino) => ({
				type: tetromino.type,
				matrix: tetromino.matrix
			}));
	}

	move(index: number, direction: MoveDirection) {
		const ok = this.boards[index].move(direction);
		if (ok) {
			this.emitPieceUpdate(index);
		}
		return ok;
	}

	moveDown(index: number) {
		const completedLines = this.boards[index].tickDown();
		if (completedLines >= 0) {
			this.handleAfterTetrominoSet(index, completedLines);
		}
		if (completedLines >= -1) {
			return true;
		}
		return false;
	}

	rotate(index: number, direction: RotationDirection) {
		const ok = this.boards[index].rotateWithWallKicks(direction);
		if (ok) {
			this.emitPieceUpdate(index);
		}
		return ok;
	}
	/**
	 * Calculate some logic after a tetromino is set (written) on the board of the given player
	 * @param index Player index
	 * @param completedLines
	 * @returns true if the game is over or false
	 */
	handleAfterTetrominoSet(index: number, completedLines: number) {
		if (completedLines > 0) {
			this.totalCompletedLines += completedLines;
			this.score[index] += completedLines * 1000;
		} else {
			this.score[index] += getRandomInt(10, 99);
		}
		if (completedLines >= 0 && !this.spawnNextTetromino(index)) {
			return true;
		}
		this.level = Math.max(1, Math.ceil(this.totalCompletedLines / 10));
		this.updateTickDownRate();
		// Add blocked lines to the other player
		if (this.playerCount > 1 && completedLines >= 2) {
			for (let otherIndex = 0; otherIndex < this.playerCount; otherIndex++) {
				if (
					otherIndex != index &&
					!this.boards[otherIndex].generateBlockedLine(completedLines - 1)
				) {
					this.gameOver(otherIndex);
					return true;
				}
				this.emitBoardUpdate(otherIndex);
				this.emitPieceUpdate(otherIndex);
			}
		}
		// console.log(this.boards[index].repr());
		return false;
	}

	dash(index: number) {
		const completedLines = this.boards[index].dash();
		if (completedLines >= 0) {
			this.handleAfterTetrominoSet(index, completedLines);
			return true;
		}
		return false;
	}

	concede(index: number) {
		return this.gameOver(index);
	}

	gameOver(loserBoardIndex: number) {
		this.emitBoardUpdate(loserBoardIndex);
		this.stop();
		if (this.playerCount == 1) {
			this.winner = 0;
		} else {
			this.winner = (loserBoardIndex + 1) % 2;
		}
		WebSocket.server.to(this.room).emit('game:over', this.winner);
		// console.log('loser');
		// console.log(this.boards[loserBoardIndex].repr());
		this.onCompletion?.(this.winner);
	}

	/**
	 * Spawn the next tetromino for the given board and return false if the board can't handle a new tetromino
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
		this.emitPieceUpdate(boardIndex);
		this.gameOver(boardIndex);
		return false;
	}

	/**
	 * Run every ~16.6667ms
	 */
	onTick(/* deltaMs: number */) {
		// console.log('tick', deltaMs, this.tick, this.nextTickDown);
		// WebSocket.server.to(this.room).emit('game:tick', this.tick + 1);
		if (this.tick >= this.nextTickDown) {
			for (let index = 0; index < this.playerCount; index++) {
				const completedLines = this.boards[index].tickDown();
				if (completedLines >= 0 && this.handleAfterTetrominoSet(index, completedLines)) {
					return true;
				} else {
					this.emitBoardUpdate(index);
					this.emitPieceUpdate(index);
				}
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
