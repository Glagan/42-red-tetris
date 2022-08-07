import type { TetrominoType } from '$shared/Tetromino';

export type GameBoard = {
	player: number;
	board: TetrominoType[][];
};
export default GameBoard;
