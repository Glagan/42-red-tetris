import type Cube from '$client/lib/Cube';
import { derived } from 'svelte/store';
import nextPieces from './nextPieces';
import idGenerator from '$utils/id.generator';
import theme from './theme';
import themes from '$client/themes/themes';

export default derived([nextPieces, theme], ($stores): Cube[][][] => {
	const calculatedNextPieces: Cube[][][] = [[], []];

	for (let player = 0; player < $stores[0].length; player++) {
		for (let piece = 0; piece < $stores[0][player].length; piece++) {
			calculatedNextPieces[player].push([]);
			const matrix = $stores[0][player][piece].matrix;
			for (let y = 0; y < matrix.length; y++) {
				for (let x = 0; x < matrix.length; x++) {
					if (matrix[y][x] === 1) {
						calculatedNextPieces[player][piece].push(<Cube>{
							id: idGenerator([player, x, y]),
							x,
							y,
							zIndex: 0,
							sprites: themes[$stores[1]].blockTextures.pieces[$stores[0][player][piece].type - 1]
						});
					}
				}
			}
		}
	}

	return calculatedNextPieces;
});
