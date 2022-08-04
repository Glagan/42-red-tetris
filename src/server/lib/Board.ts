import chalk from 'chalk';
import { TetrominoType } from './Tetrominoes/Tetromino';
import type Tetromino from './Tetrominoes/Tetromino';

export const ROWS = 20;
export const COLUMNS = 10;

export default class Board {
	movingTetromino: Tetromino | undefined;
	tetrominoes: Tetromino[];
	bitboard: TetrominoType[][];
	// Lines that are completely blocked after an opponent attack
	deepOffset: number;

	constructor() {
		this.movingTetromino = undefined;
		this.tetrominoes = [];
		this.bitboard = [];
		// * We can't use new Array.fill for rows since the references would be shared
		for (let n = 0; n < ROWS; n++) {
			this.bitboard.push(new Array(COLUMNS).fill(TetrominoType.None));
		}
		this.deepOffset = 0;
	}

	/**
	 * Check if the line given by the index is a Tetris
	 * @param index Line index
	 * @returns true if the line is a tetris or false
	 */
	checkLine(index: number) {
		if (index >= 0 && index < ROWS - this.deepOffset) {
			return this.bitboard[index].every((column) => column != TetrominoType.None);
		}
		return false;
	}

	/**
	 * Remove the line on the given index and add a new line at the top of the board
	 * @param index Line index
	 */
	removeLine(index: number) {
		if (index >= 0 && index < ROWS - this.deepOffset) {
			this.bitboard.splice(index, 1);
			this.bitboard.unshift(new Array(COLUMNS).fill(TetrominoType.None));
			// TODO this.movingTetromino ? There can't be a moving tetromino if a line is being completed
		}
	}

	/**
	 * Move the current tetromino as far down as possible and lock it directly to the board, consuming it
	 */
	dash() {
		if (this.movingTetromino) {
			while (!this.movingTetrominoIsTouching()) {
				this.clearTetrominoOnBitboard(this.movingTetromino);
				this.movingTetromino.offset[0] += 1;
				this.setTetrominoOnBitboard(this.movingTetromino);
			}
			this.tetrominoes.push(this.movingTetromino);
			this.movingTetromino = undefined;
		}
	}

	/**
	 * Move the moving tetromino one position down on the board
	 * @returns true if the current moving tetromino was consumed or false
	 */
	tickDown() {
		if (this.movingTetromino) {
			if (this.movingTetrominoIsTouching() && this.movingTetromino.locked) {
				this.tetrominoes.push(this.movingTetromino);
				this.movingTetromino = undefined;
				return true;
			}
			this.clearTetrominoOnBitboard(this.movingTetromino);
			this.movingTetromino.offset[0] += 1;
			this.setTetrominoOnBitboard(this.movingTetromino);
			if (this.movingTetrominoIsTouching()) {
				this.movingTetromino.locked = true;
			} else {
				// Clear lock if the tetromino moved from a lock position
				this.movingTetromino.locked = false;
			}
		}
		return false;
	}

	/**
	 * Update the bitboard to remove the Tetromino from it
	 * @param tetromino
	 */
	clearTetrominoOnBitboard(tetromino: Tetromino) {
		const size = tetromino.matrix.length;
		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				const inMatrix = tetromino.matrix[x][y];
				if (inMatrix) {
					const xOffset = tetromino.offset[0] + x;
					const yOffset = tetromino.offset[1] + y;
					if (xOffset >= 0 && yOffset >= 0 && xOffset < ROWS && yOffset < COLUMNS) {
						this.bitboard[xOffset][yOffset] = TetrominoType.None;
					}
				}
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
					const xOffset = tetromino.offset[0] + x;
					const yOffset = tetromino.offset[1] + y;
					if (xOffset >= 0 && yOffset >= 0 && xOffset < ROWS && yOffset < COLUMNS) {
						this.bitboard[xOffset][yOffset] = tetromino.type;
					}
				}
			}
		}
	}

	/**
	 * Check if the current tetromino is touching another tetromino or the bottom of the board
	 * @returns true if the curren tetromino is touching or false
	 */
	movingTetrominoIsTouching() {
		if (this.movingTetromino) {
			for (const [x, y] of this.movingTetromino.bottom) {
				if (
					this.movingTetromino.matrix[x][y] &&
					(this.movingTetromino.offset[0] + x + 1 >= ROWS ||
						this.bitboard[this.movingTetromino.offset[0] + x + 1][
							this.movingTetromino.offset[1] + y
						])
				) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Check if the given tetromino don't already have occupied space under it's position
	 * TODO: Wall kick to allow a tetromino to "fill" top space
	 * @param tetromino
	 * @returns true if the tetromino can spawn or false
	 */
	canSpawnTetromino(tetromino: Tetromino) {
		const size = tetromino.matrix.length;
		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				if (
					tetromino.matrix[x][y] &&
					this.bitboard[tetromino.offset[0] + x][tetromino.offset[1] + y]
				) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * Spawn the given tetromino on the board
	 * @param tetromino
	 * @returns true if the tetromino can fit on the board or false
	 */
	spawnTetromino(tetromino: Tetromino) {
		this.setTetrominoOnBitboard(tetromino);
		this.movingTetromino = tetromino;
	}

	static moveTetrominoToCenter(tetromino: Tetromino) {
		tetromino.offset[1] = Math.floor(COLUMNS / 2 - tetromino.matrix.length / 2);
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
