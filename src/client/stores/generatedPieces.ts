import type Cube from '../lib/Cube';
import { derived } from 'svelte/store';
import PiecesStore from './pieces';
import IdGenerator from '../../utils/id.generator';
import ThemeStore from './theme';

export default derived([PiecesStore, ThemeStore], ($Stores): Cube[][] => {
	const pieces: Cube[][] = [[], []];

	for (let player = 0; player < $Stores[0].length; player++) {
		const matrix = $Stores[0][player].matrix;
		for (let y = 0; y < matrix.length; y++) {
			for (let x = 0; x < matrix.length; x++) {
				if (matrix[y][x] === 1) {
					pieces[player].push(<Cube>{
						id: IdGenerator([player, x, y]),
						x: x + $Stores[0][player].x,
						y: y + $Stores[0][player].y,
						z_index: 0,
						sprites: $Stores[1].block_textures.pieces[$Stores[0][player].type - 1]
					});
				}
			}
		}
	}

	return pieces;
});
