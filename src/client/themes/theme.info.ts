import type CubeInfo from '../../routes/game/cube.info';

export default interface theme {
	block_textures: {
		pieces: Array<Array<string>>; // 7 blocks
		others: Array<Array<string>>;
	};
	backgrounds: Array<{
		left: {
			picture: string | undefined;
			_3d: { cube_size: number; cubes: Array<Array<CubeInfo>> } | undefined;
		};
		right: {
			picture: string | undefined;
			_3d: { cube_size: number; cubes: Array<Array<CubeInfo>> } | undefined;
		};
	}>;
}
