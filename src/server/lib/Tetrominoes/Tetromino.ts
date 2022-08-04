export type Matrix = number[][];

export type Coordinates = [number, number];
export type DirectionWallkicks = [
	[Coordinates, Coordinates, Coordinates, Coordinates],
	[Coordinates, Coordinates, Coordinates, Coordinates]
];
export type Wallkicks = [
	DirectionWallkicks,
	DirectionWallkicks,
	DirectionWallkicks,
	DirectionWallkicks
];

export enum TetrominoType {
	None,
	I,
	J,
	L,
	O,
	S,
	T,
	Z
}

/**
 * Shared wallkicks for the J, L, T, S and Z tetrominoes
 * @returns Wallkicks
 */
export function JLTSZWallkicks(): Wallkicks {
	return [
		[
			[
				[-1, 0],
				[-1, 1],
				[0, -2],
				[-1, -2]
			],
			[
				[1, 0],
				[1, 1],
				[0, -2],
				[1, -2]
			]
		],
		[
			[
				[1, 0],
				[1, -1],
				[0, 2],
				[1, 2]
			],
			[
				[1, 0],
				[1, -1],
				[0, 2],
				[1, 2]
			]
		],
		[
			[
				[1, 0],
				[1, 1],
				[0, -2],
				[1, -2]
			],
			[
				[-1, 0],
				[-1, 1],
				[0, -2],
				[-1, -2]
			]
		],
		[
			[
				[-1, 0],
				[-1, -1],
				[0, 2],
				[-1, 2]
			],
			[
				[-1, 0],
				[-1, -1],
				[0, 2],
				[-1, 2]
			]
		]
	];
}

export default abstract class Tetromino {
	offset: Coordinates;
	type: TetrominoType;
	matrix: Matrix;
	bottomCoordinates: Coordinates[][];
	// Array indexed [initialDirection][Clockwise/Counter-clockwise][] with the last dimension being an array of offset for the attempts
	wallKicks: Wallkicks | undefined;
	direction: number;
	// Flag for the next tickDown to set the tetromino to the bitboard
	locked: boolean;

	constructor(
		type: TetrominoType,
		matrix: Matrix,
		bottomCoordinates: Coordinates[][],
		wallKicks?: Wallkicks
	) {
		this.offset = [0, 0];
		this.matrix = matrix;
		this.bottomCoordinates = bottomCoordinates;
		this.wallKicks = wallKicks;
		this.direction = 0;
		this.type = type;
		this.locked = false;
	}

	translate(coordinates: Coordinates) {
		this.offset[0] += coordinates[0];
		this.offset[1] += coordinates[1];
	}

	rotateClockwise() {
		// Swap rows
		this.matrix.reverse();
		// Transpose
		// All matrices are square
		const N = this.matrix.length;
		for (let n = 0; n < N; n++) {
			for (let m = n; m < N; m++) {
				const tmp = this.matrix[n][m];
				this.matrix[n][m] = this.matrix[m][n];
				this.matrix[m][n] = tmp;
			}
		}
		this.direction = (this.direction + 1) % 4;
	}

	rotateCounterClockwise() {
		// Transpose
		// All matrices are square
		const N = this.matrix.length;
		for (let n = 0; n < N; n++) {
			for (let m = n; m < N; m++) {
				const tmp = this.matrix[n][m];
				this.matrix[n][m] = this.matrix[m][n];
				this.matrix[m][n] = tmp;
			}
		}
		// Swap rows
		this.matrix.reverse();
		this.direction -= 1;
		if (this.direction < 0) {
			this.direction = 3;
		}
	}

	get bottom() {
		return this.bottomCoordinates[this.direction];
	}

	/*print() {
		let repr = '';
		for (const row of this.matrix) {
			for (const column of row) {
				if (column) {
					repr += '1';
				} else {
					repr += ' ';
				}
			}
			repr += '\n';
		}
		console.log(repr);
	}*/
}
