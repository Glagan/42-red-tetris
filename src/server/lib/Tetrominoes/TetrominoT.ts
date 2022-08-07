import { TetrominoType } from '$shared/Tetromino';
import Tetromino, { JLTSZWallkicks, GenerateTetromino, type Wallkicks } from './Tetromino';

export default class TetrominoT extends Tetromino {
	static wallKicks: Wallkicks = JLTSZWallkicks();

	constructor() {
		super(TetrominoType.T, [
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0]
		]);
	}
}

GenerateTetromino(TetrominoT);
