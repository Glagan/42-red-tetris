import type { TetrominoType } from '$shared/Tetromino';
import { writable } from 'svelte/store';
import type GameBoard from '../lib/GameBoard';

const initial: TetrominoType[][][] = [[], []];

function createBoardsStore() {
	const { subscribe, update } = writable(initial);

	return {
		subscribe,
		refreshBoard: (board: GameBoard) => {
			update((boards) => {
				boards[board.player] = board.board;
				return boards;
			});
		}
	};
}

export default createBoardsStore();
