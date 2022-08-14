import type Cube from '$client/lib/Cube';
import Themes from '$client/themes/themes';
import { derived } from 'svelte/store';
import boards from './boards';
import theme from './theme';

export default derived([boards, theme], ($Stores): Cube[][] => {
	const boards: Cube[][] = [[], []];

	for (let player = 0; player < $Stores[0].length; player++) {
		for (let y = 0; y < $Stores[0][player].length; y++) {
			for (let x = 0; x < $Stores[0][player][0].length; x++) {
				const cube_value = $Stores[0][player][y][x] - 1;
				if (cube_value != -1)
					boards[player].push({
						id: y * 1000 + x * 100 + cube_value,
						x,
						y,
						z_index: 0,
						sprites: Themes[$Stores[1]].block_textures.pieces[cube_value]
					});
			}
		}
	}

	return boards;
});
