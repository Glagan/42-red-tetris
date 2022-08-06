import { TetrominoType } from '$shared/Tetromino';
import Tetromino, { GenerateTetromino, JLTSZWallkicks, type Wallkicks } from './Tetromino';

export default class TetrominoJ extends Tetromino {
	static wallKicks: Wallkicks = JLTSZWallkicks();

	constructor() {
		super(TetrominoType.J, [
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0]
		]);
	}
}

GenerateTetromino(TetrominoJ);
