import type Cube from '$client/lib/Cube';

export function backgroundUniform(sprites: string[], start: number): Cube[] {
	return [...new Array(200)].map(
		(_, index) =>
			<Cube>{
				id: start + index,
				x: index % 10,
				y: Math.floor(index / 10),
				sprites,
				zIndex: -1
			}
	);
}

export function backgroundChess(aSprites: string[], bSprites: string[], start: number): Cube[] {
	return [...new Array(200)].map((_, index) => {
		const x = index % 10;
		const y = Math.floor(index / 10);

		return <Cube>{
			id: start + index,
			x,
			y,
			sprites: index % 2 == y % 2 ? aSprites : bSprites,
			zIndex: -1
		};
	});
}

export function backgroundHoledChess(sprites: string[], start: number): Cube[] {
	return [...new Array(90)].map((_, index) => {
		index *= 2;
		const y = Math.floor(index / 10);
		const x = (index % 10) + (y % 2);

		return <Cube>{
			id: start + index,
			x,
			y,
			sprites,
			zIndex: -1
		};
	});
}
