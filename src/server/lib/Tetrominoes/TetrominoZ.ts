import Tetromino, { TetrominoType } from './Tetromino';

export default class TetrominoZ extends Tetromino {
	constructor() {
		super(TetrominoType.Z, [
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0]
		]);
	}
}
