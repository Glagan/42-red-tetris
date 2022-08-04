import Tetromino, { JLTSZWallkicks, TetrominoType } from './Tetromino';

export default class TetrominoT extends Tetromino {
	constructor() {
		super(
			TetrominoType.T,
			[
				[0, 1, 0],
				[1, 1, 1],
				[0, 0, 0]
			],
			[
				[
					[1, 0],
					[1, 1],
					[1, 2]
				],
				[
					[2, 1],
					[1, 2]
				],
				[
					[1, 0],
					[2, 1],
					[1, 2]
				],
				[
					[1, 0],
					[2, 1]
				]
			],
			JLTSZWallkicks()
		);
	}
}
