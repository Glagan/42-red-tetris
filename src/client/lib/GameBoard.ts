import type { TetrominoType } from '$shared/Tetromino';

export type GameBoard = {
	player: number;
	level: number;
	score: number;
	board: TetrominoType[][];
};
export default GameBoard;
