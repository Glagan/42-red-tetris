import type { TetrominoType } from '$shared/Tetromino';

export type GameBoard = {
	player: number;
	score: number;
	board: TetrominoType[][];
};
export default GameBoard;
