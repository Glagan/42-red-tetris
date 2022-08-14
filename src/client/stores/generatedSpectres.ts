/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type Cube from '$client/lib/Cube';
import { derived } from 'svelte/store';
import pieces from './pieces';
import idGenerator from '$utils/id.generator';
import theme from './theme';
import themes from '$client/themes/themes';

export default derived([pieces, theme], ($stores): Cube[][] => {
	const pieces: Cube[][] = [[], []];

	for (let player = 0; player < $stores[0].length; player++) {
		if ($stores[0][player].spectre != undefined) {
			const matrix = $stores[0][player].matrix;
			for (let y = 0; y < matrix.length; y++) {
				for (let x = 0; x < matrix.length; x++) {
					if (matrix[y][x] === 1) {
						pieces[player].push(<Cube>{
							id: idGenerator([player, x, y]),
							x: x + $stores[0][player].spectre!.x,
							y: y + $stores[0][player].spectre!.y,
							zIndex: 0,
							sprites: themes[$stores[1]].blockTextures.pieces[$stores[0][player].type - 1]
						});
					}
				}
			}
		}
	}

	return pieces;
});
