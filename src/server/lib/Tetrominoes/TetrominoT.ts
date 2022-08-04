import Tetromino, { TetrominoType } from './Tetromino';

export default class TetrominoT extends Tetromino {
	constructor() {
		super(TetrominoType.T, [
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0]
		]);
	}
}
