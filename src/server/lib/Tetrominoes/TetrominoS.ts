import Tetromino, { TetrominoType } from './Tetromino';

export default class TetrominoS extends Tetromino {
	constructor() {
		super(TetrominoType.S, [
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0]
		]);
	}
}
