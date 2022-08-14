import type Cube from '$client/lib/Cube';
import { derived } from 'svelte/store';
import pieces from './pieces';
import idGenerator from '$utils/id.generator';
import theme from './theme';
import themes from '$client/themes/themes';

export default derived([pieces, theme], ($Stores): Cube[][] => {
	const pieces: Cube[][] = [[], []];

	for (let player = 0; player < $Stores[0].length; player++) {
		const matrix = $Stores[0][player].matrix;
		for (let y = 0; y < matrix.length; y++) {
			for (let x = 0; x < matrix.length; x++) {
				if (matrix[y][x] === 1) {
					pieces[player].push(<Cube>{
						id: idGenerator([player, x, y]),
						x: x + $Stores[0][player].x,
						y: y + $Stores[0][player].y,
						z_index: 0,
						sprites: themes[$Stores[1]].block_textures.pieces[$Stores[0][player].type - 1]
					});
				}
			}
		}
	}

	return pieces;
});
