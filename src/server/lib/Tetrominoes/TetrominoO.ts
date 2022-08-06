import { TetrominoType } from '$shared/Tetromino';
import Tetromino, { GenerateTetromino, type Wallkicks } from './Tetromino';

export default class TetrominoO extends Tetromino {
	static wallKicks: Wallkicks | undefined = undefined;

	constructor() {
		super(TetrominoType.O, [
			[1, 1],
			[1, 1]
		]);
	}

	rotateClockwise() {
		// Nothing to do
	}

	rotateCounterClockwise() {
		// Nothing to do
	}
}

GenerateTetromino(TetrominoO);
