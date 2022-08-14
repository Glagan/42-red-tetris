import type Theme from '$client/lib/Theme';
import * as Generator from '$client/themes/generators/background';

const pieces_block_textures = [
	[
		// 0
		'/sprites/temple/red/tile006.png',
		'/sprites/temple/red/tile004.png'
	],
	[
		// 1
		'/sprites/temple/red/tile007.png',
		'/sprites/temple/red/tile004.png'
	],
	[
		// 2
		'/sprites/temple/red/tile008.png',
		'/sprites/temple/red/tile004.png'
	],
	[
		// 3
		'/sprites/temple/red/tile009.png',
		'/sprites/temple/red/tile004.png'
	],
	[
		// 4
		'/sprites/temple/red/tile010.png',
		'/sprites/temple/red/tile004.png'
	],
	[
		// 5
		'/sprites/temple/red/tile011.png',
		'/sprites/temple/red/tile004.png'
	],
	[
		// 6
		'/sprites/temple/red/tile012.png',
		'/sprites/temple/red/tile004.png'
	],
	[
		// 7
		'/sprites/temple/red/tile013.png',
		'/sprites/temple/red/tile004.png'
	]
];

const other_block_textures = [['/sprites/temple/red/tile004.png']];

export default <Theme>{
	name: 'temple 3',
	blockTextures: {
		pieces: pieces_block_textures,
		others: other_block_textures
	},
	background: {
		left: {
			_3d: {
				cubeSize: 32,
				cubes: [Generator.backgroundUniform(other_block_textures[0], 1000)]
			},
			brightness: 20
		},
		right: {
			_3d: {
				cubeSize: 32,
				cubes: [Generator.backgroundUniform(other_block_textures[0], 200)]
			},
			brightness: 20
		}
	}
};
