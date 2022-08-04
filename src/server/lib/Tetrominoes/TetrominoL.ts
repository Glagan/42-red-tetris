import Tetromino, { TetrominoType } from './Tetromino';

export default class TetrominoL extends Tetromino {
	constructor() {
		super(TetrominoType.L, [
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0]
		]);
	}
}
