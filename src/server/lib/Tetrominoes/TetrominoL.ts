import { TetrominoType } from '$shared/Tetromino';
import Tetromino, { JLTSZWallkicks, GenerateTetromino, type Wallkicks } from './Tetromino';

export default class TetrominoL extends Tetromino {
	static wallKicks: Wallkicks = JLTSZWallkicks();

	constructor() {
		super(TetrominoType.L, [
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0]
		]);
	}
}

GenerateTetromino(TetrominoL);
