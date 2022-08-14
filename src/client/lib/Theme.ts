import type Cube from './Cube';

export default interface Theme {
	name: string;
	blockTextures: {
		pieces: string[][]; // 7 blocks
		others: string[][];
	};
	background: {
		left: {
			picture: string | undefined;
			_3d: { cubeSize: number; cubes: Cube[][] } | undefined;
			brightness: number;
		};
		right: {
			picture: string | undefined;
			_3d: { cubeSize: number; cubes: Cube[][] } | undefined;
			brightness: number;
		};
	};
}
