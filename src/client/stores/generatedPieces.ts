import type Cube from '../lib/Cube';
import { derived } from 'svelte/store';
import PiecesStore from './pieces';
import IdGenerator from '../../utils/id.generator';
import ThemeStore from './theme';

export default derived([PiecesStore, ThemeStore], ($Stores): Cube[][] => {
	const pieces: Cube[][] = [[], []];

	console.log($Stores[0]);
	for (let i = 0; i < $Stores[0].length; i++) {
		const matrix = $Stores[0][i].matrix;
		for (let y = 0; y < matrix.length; y++) {
			for (let x = 0; x < matrix.length; x++) {
				if (matrix[y][x] === 1) {
					pieces[i].push(<Cube>{
						id: IdGenerator([i, x, y]),
						x: x + $Stores[0][i].x,
						y: y + $Stores[0][i].y,
						z_index: 0,
						sprites: $Stores[1].block_textures.pieces[$Stores[0][i].type - 1]
					});
				}
			}
		}
	}

	return pieces;
});
