import type GamePiece from '$client/lib/GamePiece';
import { TetrominoType } from '$shared/Tetromino';
import { writable } from 'svelte/store';

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
				console.log('-------------------------------------- store [pieces] 1');
				console.log('avant:');
				console.log(pieces);
				pieces[piece.player] = piece;
				console.log('apres:');
				console.log(pieces);
				return pieces;
			})
	};
}

export default createPiecesStore();
