import chalk from 'chalk';
import { TetrominoType } from './Tetrominoes/Tetromino';
import type Tetromino from './Tetrominoes/Tetromino';

const ROWS = 20;
const COLUMNS = 10;

export default class Board {
	movingTetromino: Tetromino | undefined;
	tetrominoes: Tetromino[];
	bitboard: TetrominoType[][];

	constructor() {
		this.movingTetromino = undefined;
		this.tetrominoes = [];
		this.bitboard = [];
		// * We can't use new Array.fill for rows since the references would be shared
		for (let n = 0; n < ROWS; n++) {
			this.bitboard.push(new Array(COLUMNS).fill(TetrominoType.None));
		}
	}

	/**
	 * Check if the line given by the index is a Tetris
	 * @param index Line index
	 * @returns true if the line is a tetris or false
	 */
	checkLine(index: number) {
		if (index >= 0 && index < ROWS) {
			return this.bitboard[index].every((column) => column != TetrominoType.None);
		}
		return false;
	}

	/**
	 * Remove the line on the given index and add a new line at the top of the board
	 * @param index Line index
	 */
	removeLine(index: number) {
		if (index >= 0 && index < ROWS) {
			this.bitboard.splice(index, 1);
			this.bitboard.unshift(new Array(COLUMNS).fill(TetrominoType.None));
			// TODO this.movingTetromino ? There can't be a moving tetromino if a line is being completed
		}
	}

	/**
	 * Move the moving tetromino one position down on the board
	 */
	tickDown() {
		if (this.movingTetromino) {
			this.clearTetrominoOnBitboard(this.movingTetromino);
			this.movingTetromino.offset[0] += 1;
			this.setTetrominoOnBitboard(this.movingTetromino);
			// TODO: Is touching -> lock delay start
		}
	}

	/**
	 * Update the bitboard to remove the Tetromino from it
	 * @param tetromino
	 */
	clearTetrominoOnBitboard(tetromino: Tetromino) {
		const size = tetromino.matrix.length;
		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				this.bitboard[tetromino.offset[0] + x][tetromino.offset[1] + y] = TetrominoType.None;
			}
		}
	}

	/**
	 * Update the bitboard to add the Tetromino on it
	 * @param tetromino
	 */
	setTetrominoOnBitboard(tetromino: Tetromino) {
		const size = tetromino.matrix.length;
		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				const inMatrix = tetromino.matrix[x][y];
				if (inMatrix) {
					this.bitboard[tetromino.offset[0] + x][tetromino.offset[1] + y] = tetromino.type;
				}
			}
		}
	}

	/**
	 * Spawn the given tetromino on the board
	 * @param tetromino
	 * @returns true if the tetromino can fit on the board or false
	 */
	spawnTetromino(tetromino: Tetromino) {
		tetromino.offset[1] = Math.floor(COLUMNS / 2 - tetromino.matrix.length / 2);
		this.setTetrominoOnBitboard(tetromino);
		this.movingTetromino = tetromino;
		// TODO: is touching ? Lock delay ? Can move before lock delay and is not locked -> remove lock delay
		return true;
	}

	repr() {
		let repr = '';
		for (const row of this.bitboard) {
			for (const column of row) {
				switch (column) {
					case TetrominoType.I:
						repr += chalk.bgCyanBright(' ').toString();
						break;
					case TetrominoType.J:
						repr += chalk.bgBlue(' ').toString();
						break;
					case TetrominoType.L:
						repr += chalk.bgRgb(255, 156, 0)(' ').toString();
						break;
					case TetrominoType.O:
						repr += chalk.bgYellow(' ').toString();
						break;
					case TetrominoType.S:
						repr += chalk.bgGreenBright(' ').toString();
						break;
					case TetrominoType.T:
						repr += chalk.bgMagenta(' ').toString();
						break;
					case TetrominoType.Z:
						repr += chalk.bgRed(' ').toString();
						break;
					default:
						repr += chalk.bgBlack(' ').toString();
						break;
				}
			}
			repr += '\n';
		}
		return repr;
	}
}
