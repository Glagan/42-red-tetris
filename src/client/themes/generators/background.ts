import type Cube from '$client/lib/Cube';

export function background_uniform(sprites: string[], id_start: number): Cube[] {
	return [...new Array(200)].map(
		(_, index) =>
			<Cube>{
				id: id_start + index,
				x: index % 10,
				y: Math.floor(index / 10),
				sprites,
				z_index: -1
			}
	);
}

export function background_chess(
	a_sprites: string[],
	b_sprites: string[],
	id_start: number
): Cube[] {
	return [...new Array(200)].map((_, index) => {
		const x = index % 10;
		const y = Math.floor(index / 10);

		return <Cube>{
			id: id_start + index,
			x,
			y,
			sprites: index % 2 == y % 2 ? a_sprites : b_sprites,
			z_index: -1
		};
	});
}

export function background_holed_chess(sprites: string[], id_start: number): Cube[] {
	return [...new Array(90)].map((_, index) => {
		index *= 2;
		const y = Math.floor(index / 10);
		const x = (index % 10) + (y % 2);

		return <Cube>{
			id: id_start + index,
			x,
			y,
			sprites,
			z_index: -1
		};
	});
}
