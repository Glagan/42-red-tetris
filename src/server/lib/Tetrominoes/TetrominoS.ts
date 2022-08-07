import { TetrominoType } from '$shared/Tetromino';

import Tetromino, { JLTSZWallkicks, GenerateTetromino, type Wallkicks } from './Tetromino';

export default class TetrominoS extends Tetromino {
	static wallKicks: Wallkicks = JLTSZWallkicks();

	constructor() {
		super(TetrominoType.S, [
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0]
		]);
	}
}

GenerateTetromino(TetrominoS);
