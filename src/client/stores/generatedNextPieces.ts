import type Cube from '$client/lib/Cube';
import { derived } from 'svelte/store';
import nextPieces from './nextPieces';
import idGenerator from '$utils/id.generator';
import theme from './theme';
import themes from '$client/themes/themes';

export default derived([nextPieces, theme], ($Stores): Cube[][][] => {
	const next_pieces: Cube[][][] = [[], []];

	for (let player = 0; player < $Stores[0].length; player++) {
		for (let piece = 0; piece < $Stores[0][player].length; piece++) {
			next_pieces[player].push([]);
			const matrix = $Stores[0][player][piece].matrix;
			for (let y = 0; y < matrix.length; y++) {
				for (let x = 0; x < matrix.length; x++) {
					if (matrix[y][x] === 1) {
						next_pieces[player][piece].push(<Cube>{
							id: idGenerator([player, x, y]),
							x,
							y,
							z_index: 0,
							sprites: themes[$Stores[1]].block_textures.pieces[$Stores[0][player][piece].type - 1]
						});
					}
				}
			}
		}
	}

	return next_pieces;
});
