import type Cube from './Cube';

export default interface Theme {
	block_textures: {
		pieces: string[][]; // 7 blocks
		others: string[][];
	};
	backgrounds: {
		left: {
			picture: string | undefined;
			_3d: { cube_size: number; cubes: Cube[][] } | undefined;
		};
		right: {
			picture: string | undefined;
			_3d: { cube_size: number; cubes: Cube[][] } | undefined;
		};
	}[];
}
