import Tetromino, { JLTSZWallkicks, TetrominoType } from './Tetromino';

export default class TetrominoZ extends Tetromino {
	constructor() {
		super(
			TetrominoType.Z,
			[
				[1, 1, 0],
				[0, 1, 1],
				[0, 0, 0]
			],
			[
				[
					[0, 0],
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
					[2, 2]
				],
				[
					[2, 0],
					[1, 1]
				]
			],
			JLTSZWallkicks()
		);
	}
}
