import type Cube from '../lib/Cube';
import { derived } from 'svelte/store';
import BoardsStore from './boards';
import ThemeStore from './theme';

export default derived([BoardsStore, ThemeStore], ($Stores): Cube[][] => {
	const boards: Cube[][] = [[], []];

	for (let i = 0; i < $Stores[0].length; i++) {
		for (let y = 0; y < $Stores[0][i].length; y++) {
			for (let x = 0; x < $Stores[0][i][0].length; x++) {
				const cube_value = $Stores[0][i][y][x] - 1;
				if (cube_value != -1)
					boards[i].push({
						id: y * 1000 + x * 100 + cube_value,
						x,
						y,
						z_index: 0,
						sprites: $Stores[1].block_textures.pieces[cube_value]
					});
			}
		}
	}

	return boards;
});
