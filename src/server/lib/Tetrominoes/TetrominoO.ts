import Tetromino, { TetrominoType } from './Tetromino';

export default class TetrominoO extends Tetromino {
	constructor() {
		super(TetrominoType.O, [
			[0, 1, 1, 0],
			[0, 1, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);
	}

	rotateClockwise() {
		// Nothing to do
	}

	rotateCounterClockwise() {
		// Nothing to do
	}
}
