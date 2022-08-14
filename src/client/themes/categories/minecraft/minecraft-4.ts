import type Theme from '$client/lib/Theme';
import * as Generator from '$client/themes/generators/background';

const pieces_block_textures = [
	[
		// 0
		'/sprites/minecraft/tile003.png',
		'/sprites/minecraft/tile000.png',
		'/sprites/minecraft/tile002.png'
	],
	[
		// 1
		'/sprites/minecraft/tile001.png'
	],
	[
		// 2
		'/sprites/minecraft/tile004.png'
	],
	[
		// 3
		'/sprites/minecraft/tile020.png',
		'/sprites/minecraft/tile021.png'
	],
	[
		// 4
		'/sprites/minecraft/tile018.png'
	],
	[
		// 5
		'/sprites/minecraft/lava.webp'
	],
	[
		// 6
		'/sprites/minecraft/water.webp'
	],
	[
		// 7
		'/sprites/minecraft/tile017.png'
	]
];

const other_block_textures = [
	[
		// 0 Black write
		'/sprites/minecraft/tile064.png'
	],
	[
		// 1 Black wool
		'/sprites/minecraft/tile113.png'
	]
];

export default <Theme>{
	name: 'minecraft 4',
	blockTextures: {
		pieces: pieces_block_textures,
		others: other_block_textures
	},
	background: {
		left: {
			_3d: {
				cubeSize: 16,
				cubes: [Generator.backgroundChess(other_block_textures[0], other_block_textures[1], 1000)]
			},
			brightness: 100
		},
		right: {
			_3d: {
				cubeSize: 16,
				cubes: [Generator.backgroundChess(other_block_textures[0], other_block_textures[1], 1000)]
			},
			brightness: 100
		}
	}
};
