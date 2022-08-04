import Tetromino, { TetrominoType } from './Tetromino';

export default class TetrominoI extends Tetromino {
	constructor() {
		super(TetrominoType.I, [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);
	}
}
