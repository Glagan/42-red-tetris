export type Matrix = number[][];

export type Coordinates = [number, number];

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

export default abstract class Tetromino {
	offset: Coordinates;
	type: TetrominoType;
	matrix: Matrix;
	bottom!: Coordinates[];
	locked: boolean;

	constructor(type: TetrominoType, matrix: Matrix) {
		this.offset = [0, 0];
		this.matrix = matrix;
		this.type = type;
		this.calculateBottom();
		this.locked = false;
	}

	calculateBottom() {
		this.bottom = [];
		const N = this.matrix.length;
		for (let m = N - 1; m >= 0; m--) {
			for (let n = N - 1; n >= 0; n--) {
				if (this.matrix[n][m]) {
					this.bottom.push([n, m]);
					break;
				}
			}
		}
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
		this.calculateBottom();
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
		this.calculateBottom();
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
