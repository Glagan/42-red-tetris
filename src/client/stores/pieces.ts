import { writable } from 'svelte/store';
import type GamePiece from '$client/lib/GamePiece';
import { TetrominoType } from '$shared/Tetromino';

function createPiecesStore() {
	const { subscribe, update } = writable<GamePiece[]>([
		<GamePiece>{
			player: 0,
			x: 0,
			y: 0,
			matrix: [[0]],
			type: TetrominoType.None
		},
		<GamePiece>{
			player: 1,
			x: 0,
			y: 0,
			matrix: [[0]],
			type: TetrominoType.None
		}
	]);

	return {
		subscribe,
		updatePiece: (piece: GamePiece) =>
			update((pieces) => {
				pieces[piece.player] = piece;
				return pieces;
			})
	};
}

export default createPiecesStore();
