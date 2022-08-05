import chalk from 'chalk';
import { TetrominoType } from './Tetrominoes/Tetromino';
import type Tetromino from './Tetrominoes/Tetromino';

export const ROWS = 20;
export const COLUMNS = 10;

export enum RotationDirection {
	Clockwise,
	Counterclockwise
}

export enum MoveDirection {
	Left,
	Right
}

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
	 * @param index
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
	 * @param index
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
			return true;
		}
		return false;
	}

	move(direction: MoveDirection) {
		if (this.movingTetromino) {
			const offset = direction == MoveDirection.Left ? -1 : 1;
			this.movingTetromino.offset[1] += offset;
			for (const [x, y] of this.movingTetromino.blocks) {
				const xOffset = this.movingTetromino.offset[0] + x;
				const yOffset = this.movingTetromino.offset[1] + y;
				if (
					xOffset < 0 ||
					yOffset < 0 ||
					xOffset >= ROWS ||
					yOffset >= COLUMNS ||
					this.bitboard[xOffset][yOffset] != TetrominoType.None
				) {
					this.movingTetromino.offset[1] -= offset;
					return false;
				}
			}
			return true;
		}
		return false;
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
	 * Rotate (if possible) the current tetromino with wallkicks enabled
	 */
	rotateWithWallKicks(rotationDirection: RotationDirection) {
		if (this.movingTetromino) {
			const tetromino = this.movingTetromino;
			this.clearTetrominoOnBitboard(tetromino);
			if (rotationDirection == RotationDirection.Clockwise) {
				tetromino.rotateClockwise();
			} else {
				tetromino.rotateCounterClockwise();
			}
			// If the initial position can be rotated
			// The tetromino is simply added back to the board
			if (this.canSetTetrominoOnBitboard(tetromino)) {
				this.setTetrominoOnBitboard(tetromino);
				return;
			}
			// Wallkicks
			else if (tetromino.wallKicksInDirection) {
				const wallkicks = tetromino.wallKicksInDirection[rotationDirection];
				for (const wallkick of wallkicks) {
					// Apply translate and check if the tetromino fit on the board
					tetromino.translate(wallkick);
					if (this.canSetTetrominoOnBitboard(tetromino)) {
						this.setTetrominoOnBitboard(tetromino);
						return;
					}
					// Remove translate
					tetromino.translate([-wallkick[0], -wallkick[1]]);
				}
			}

			// If no rotation was possible restore the initial position and rotation
			if (rotationDirection == RotationDirection.Clockwise) {
				tetromino.rotateCounterClockwise();
			} else {
				tetromino.rotateClockwise();
			}
			this.setTetrominoOnBitboard(tetromino);
		}
	}

	/**
	 * Update the bitboard to remove the Tetromino from it
	 * @param tetromino
	 */
	clearTetrominoOnBitboard(tetromino: Tetromino) {
		for (const [x, y] of tetromino.blocks) {
			const xOffset = tetromino.offset[0] + x;
			const yOffset = tetromino.offset[1] + y;
			if (xOffset >= 0 && yOffset >= 0 && xOffset < ROWS && yOffset < COLUMNS) {
				this.bitboard[xOffset][yOffset] = TetrominoType.None;
			}
		}
	}

	canSetTetrominoOnBitboard(tetromino: Tetromino) {
		for (const [x, y] of tetromino.blocks) {
			if (
				tetromino.matrix[x][y] &&
				this.bitboard[tetromino.offset[0] + x][tetromino.offset[1] + y]
			) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Update the bitboard to add the Tetromino on it
	 * @param tetromino
	 */
	setTetrominoOnBitboard(tetromino: Tetromino) {
		for (const [x, y] of tetromino.blocks) {
			const xOffset = tetromino.offset[0] + x;
			const yOffset = tetromino.offset[1] + y;
			if (xOffset >= 0 && yOffset >= 0 && xOffset < ROWS && yOffset < COLUMNS) {
				this.bitboard[xOffset][yOffset] = tetromino.type;
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
	 * TODO: Wall kick to allow a tetromino to "fill" top space ?
	 * @param tetromino
	 * @returns true if the tetromino can spawn or false
	 */
	canSpawnTetromino(tetromino: Tetromino) {
		return this.canSetTetrominoOnBitboard(tetromino);
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

	/**
	 * Set the given tetromino offset to the horizontal center of the board
	 * @param tetromino
	 */
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
