import { TetrominoType } from '$shared/Tetromino';
import Tetromino, { JLTSZWallkicks, GenerateTetromino, type Wallkicks } from './Tetromino';

export default class TetrominoZ extends Tetromino {
	static wallKicks: Wallkicks = JLTSZWallkicks();

	constructor() {
		super(TetrominoType.Z, [
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0]
		]);
	}
}

GenerateTetromino(TetrominoZ);
