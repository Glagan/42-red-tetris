import chalk from 'chalk';
import { TetrominoType } from '$shared/Tetromino';
import type Tetromino from './Tetrominoes/Tetromino';
import { getRandomInt } from '$utils/random';

export const ROWS = 20;
export const COLUMNS = 10;

export enum RotationDirection {
	Clockwise,
	CounterClockwise
}

export enum MoveDirection {
	Left,
	Right
}

export default class Board {
	movingTetromino: Tetromino | undefined;
	tetrominoes: Tetromino[];
	bitboard: TetrominoType[][];
	// Empty column in the blocked line at the bottom of the board
	emptyLineBlockedColumn?: number;

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
	 * @param index
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
	 * @param index
	 */
	removeLine(index: number) {
		if (index >= 0 && index < ROWS) {
			this.bitboard.splice(index, 1);
			this.bitboard.unshift(new Array(COLUMNS).fill(TetrominoType.None));
			// TODO this.movingTetromino ? There can't be a moving tetromino if a line is being completed
		}
	}

	/**
	 * Check the lines on the board from the bottom and remove all of them if they are tetris
	 * @returns The amount of removed tetris
	 */
	clearAllCompletedLines() {
		let count = 0;
		for (let index = ROWS - 1; index >= 0; index--) {
			if (this.checkLine(index)) {
				this.removeLine(index);
				index += 1;
				count += 1;
			} else {
				break;
			}
		}
		return count;
	}

	/**
	 * Move the current tetromino as far down as possible and lock it directly to the board, consuming it
	 */
	dash() {
		if (this.movingTetromino) {
			while (!this.movingTetrominoIsTouching()) {
				this.movingTetromino.offset[0] += 1;
			}
			this.tetrominoes.push(this.movingTetromino);
			this.setTetrominoOnBitboard(this.movingTetromino);
			this.movingTetromino = undefined;
			return this.clearAllCompletedLines();
		}
		return -1;
	}

	move(direction: MoveDirection) {
		if (this.movingTetromino) {
			const offset = direction == MoveDirection.Left ? -1 : 1;
			this.movingTetromino.offset[1] += offset;
			if (this.canSetTetrominoOnBitboard(this.movingTetromino)) {
				return true;
			}
			this.movingTetromino.offset[1] -= offset;
		}
		return false;
	}

	/**
	 * Move the moving tetromino one position down on the board and clear completed lines
	 * @returns -1 if the tetromino was *not* consumed, or the amount of completed lines
	 */
	tickDown() {
		if (this.movingTetromino) {
			if (this.movingTetrominoIsTouching()) {
				if (this.movingTetromino.locked) {
					this.tetrominoes.push(this.movingTetromino);
					this.setTetrominoOnBitboard(this.movingTetromino);
					this.movingTetromino = undefined;
					return this.clearAllCompletedLines();
				} else {
					this.movingTetromino.locked = true;
					return -1;
				}
			}
			this.movingTetromino.offset[0] += 1;
			// Clear lock if the tetromino moved from a lock position
			this.movingTetromino.locked = false;
		}
		return -1;
	}

	/**
	 * Generate a random column to be the next empty column in the blocked lines
	 * If there already is a column, it has a 66% chance to be re-used
	 */
	nextBlockedLineBlockedColumn() {
		if (!this.emptyLineBlockedColumn || getRandomInt(0, 100) > 66) {
			this.emptyLineBlockedColumn = getRandomInt(1, COLUMNS - 1);
		}
		return this.emptyLineBlockedColumn;
	}

	/**
	 * Add the given amount of blocked lines at the bottom of the board with one empty column in it.
	 * The current tetromino is kept on the same position, but is set with *wallkicks* to try to keep the player alive.
	 * @param amount Amount of blocked lines to add
	 * @returns true if all of the lines were added or false if the board id losing
	 */
	generateBlockedLine(amount: number) {
		const emptyColumn = this.nextBlockedLineBlockedColumn();
		for (let index = 0; index < amount; index++) {
			// Check if the new line *can* be inserted, or else it's a lose (Ignore moving tetromino)
			if (!this.bitboard[0].every((column) => column == TetrominoType.None)) {
				return false;
			}
			// Append the new line at the bottom of the board
			const blockedLine = new Array(COLUMNS).fill(TetrominoType.Blocked);
			blockedLine[emptyColumn] = TetrominoType.None;
			this.bitboard.push(blockedLine);
			// Remove the line at the top and try to keep the current tetromino position
			this.bitboard.splice(0, 1);
			if (this.movingTetromino) {
				return this.fixTetrominoPosition(this.movingTetromino);
			}
		}
		return true;
	}

	/**
	 * Rotate (if possible) the current tetromino with wallkicks enabled
	 */
	rotateWithWallKicks(rotationDirection: RotationDirection) {
		if (this.movingTetromino) {
			const tetromino = this.movingTetromino;
			if (rotationDirection == RotationDirection.Clockwise) {
				tetromino.rotateClockwise();
			} else {
				tetromino.rotateCounterClockwise();
			}
			// If the initial position can be rotated
			// The tetromino is simply added back to the board
			if (this.canSetTetrominoOnBitboard(tetromino)) {
				return true;
			}
			// Wallkicks
			else if (tetromino.wallKicksInDirection) {
				const wallkicks = tetromino.wallKicksInDirection[rotationDirection];
				for (const wallkick of wallkicks) {
					// Apply translate and check if the tetromino fit on the board
					tetromino.translate(wallkick);
					if (this.canSetTetrominoOnBitboard(tetromino)) {
						return true;
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
		}
		return false;
	}

	canSetTetrominoOnBitboard(tetromino: Tetromino) {
		return tetromino.blocks.every(([x, y]) => {
			const xOffset = tetromino.offset[0] + x;
			const yOffset = tetromino.offset[1] + y;
			return (
				xOffset >= 0 &&
				yOffset >= 0 &&
				xOffset < ROWS &&
				yOffset < COLUMNS &&
				!this.bitboard[xOffset][yOffset]
			);
		});
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
	 * Check if at least one of the block in the tetromino is out of the board, trigerring a loss
	 * @param tetromino
	 * @returns true if the tetromino is out of the board or false
	 */
	tetrominoIsOut(tetromino: Tetromino) {
		for (const [x, y] of tetromino.blocks) {
			const xOffset = tetromino.offset[0] + x;
			const yOffset = tetromino.offset[1] + y;
			if (xOffset < 0 || yOffset < 0 || xOffset >= ROWS || yOffset >= COLUMNS) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Fix the tetromino position so it can be set on the board, going up if needed
	 * @param tetromino
	 * @returns true if the tetromino can be set on the board or false
	 */
	fixTetrominoPosition(tetromino: Tetromino) {
		if (this.canSetTetrominoOnBitboard(tetromino)) {
			return true;
		}
		while (!this.canSetTetrominoOnBitboard(tetromino)) {
			tetromino.translate([-1, 0]);
			if (this.tetrominoIsOut(tetromino)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Check if the current tetromino is touching another tetromino or the bottom of the board
	 * @returns true if the curren tetromino is touching or false
	 */
	movingTetrominoIsTouching() {
		if (this.movingTetromino) {
			for (const [x, y] of this.movingTetromino.bottom) {
				const xOffset = this.movingTetromino.offset[0] + x;
				const yOffset = this.movingTetromino.offset[1] + y;
				// Also check deepOffset to handle enemy lines
				if (xOffset + 1 >= ROWS || this.bitboard[xOffset + 1][yOffset]) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Check if the given tetromino don't already have occupied space under it's position
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
		this.movingTetromino = tetromino;
		return this.fixTetrominoPosition(this.movingTetromino);
	}

	/**
	 * Set the given tetromino offset to the horizontal center of the board
	 * @param tetromino
	 */
	static translateTetrominoToCenter(tetromino: Tetromino) {
		tetromino.offset[1] = Math.floor(COLUMNS / 2 - tetromino.matrix.length / 2);
	}

	/* c8 ignore start */
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
					case TetrominoType.Blocked:
						repr += chalk.bgGray(' ').toString();
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
	/* c8 ignore end */
}
