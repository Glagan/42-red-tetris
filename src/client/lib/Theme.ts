import type Cube from './Cube';

export default interface Theme {
	name: string;
	block_textures: {
		pieces: string[][]; // 7 blocks
		others: string[][];
	};
	background: {
		left: {
			picture: string | undefined;
			_3d: { cube_size: number; cubes: Cube[][] } | undefined;
		};
		right: {
			picture: string | undefined;
			_3d: { cube_size: number; cubes: Cube[][] } | undefined;
		};
	};
}
