import type Cube from '$client/lib/Cube';
import Themes from '$client/themes/themes';
import { derived } from 'svelte/store';
import boards from './boards';
import theme from './theme';

export default derived([boards, theme], ($stores): Cube[][] => {
	const boards: Cube[][] = [[], []];

	for (let player = 0; player < $stores[0].length; player++) {
		for (let y = 0; y < $stores[0][player].length; y++) {
			for (let x = 0; x < $stores[0][player][0].length; x++) {
				const cubeValue = $stores[0][player][y][x] - 1;
				if (cubeValue != -1)
					boards[player].push({
						id: y * 1000 + x * 100 + cubeValue,
						x,
						y,
						zIndex: 0,
						sprites: Themes[$stores[1]].blockTextures.pieces[cubeValue]
					});
			}
		}
	}

	return boards;
});
