import type Theme from '$client/lib/Theme';
import * as Generator from '$client/themes/generators/background';

const pieces_block_textures = [
	[
		// 0
		'/sprites/temple/blue/tile006.png',
		'/sprites/temple/blue/tile004.png'
	],
	[
		// 1
		'/sprites/temple/blue/tile007.png',
		'/sprites/temple/blue/tile004.png'
	],
	[
		// 2
		'/sprites/temple/blue/tile008.png',
		'/sprites/temple/blue/tile004.png'
	],
	[
		// 3
		'/sprites/temple/blue/tile009.png',
		'/sprites/temple/blue/tile004.png'
	],
	[
		// 4
		'/sprites/temple/blue/tile010.png',
		'/sprites/temple/blue/tile004.png'
	],
	[
		// 5
		'/sprites/temple/blue/tile011.png',
		'/sprites/temple/blue/tile004.png'
	],
	[
		// 6
		'/sprites/temple/blue/tile012.png',
		'/sprites/temple/blue/tile004.png'
	],
	[
		// 7
		'/sprites/temple/blue/tile013.png',
		'/sprites/temple/blue/tile004.png'
	]
];

const other_block_textures = [['/sprites/temple/blue/tile004.png']];

export default <Theme>{
	name: 'temple 2',
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
				cubes: [Generator.backgroundUniform(other_block_textures[0], 1000)]
			},
			brightness: 20
		}
	}
};
