import { TetrominoType } from '$shared/Tetromino';
import Tetromino, { GenerateTetromino, type Wallkicks } from './Tetromino';

export default class TetrominoI extends Tetromino {
	static wallKicks: Wallkicks = [
		[
			[
				[-2, 0],
				[1, 0],
				[-2, -1],
				[1, 2]
			],
			[
				[-1, 0],
				[2, 0],
				[-1, 2],
				[2, -1]
			]
		],
		[
			[
				[-1, 0],
				[2, 0],
				[-1, 2],
				[2, -1]
			],
			[
				[2, 0],
				[-1, 0],
				[2, 1],
				[-1, -2]
			]
		],
		[
			[
				[2, 0],
				[-1, 0],
				[2, 1],
				[-1, -2]
			],
			[
				[1, 0],
				[-2, 0],
				[1, -2],
				[-2, 1]
			]
		],
		[
			[
				[1, 0],
				[-2, 0],
				[1, -2],
				[-2, 1]
			],
			[
				[-2, 0],
				[1, 0],
				[-2, -1],
				[1, 2]
			]
		]
	];

	constructor() {
		super(TetrominoType.I, [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]);
	}
}

GenerateTetromino(TetrominoI);
