import type Theme from './theme.info';
import * as Generator from './generators/background';

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
		'/sprites/minecraft/tile017.webp'
	]
];

const other_block_textures = [
	[
		// 0 Diamond
		'/sprites/minecraft/tile024.png'
	],
	[
		// 1 Gold
		'/sprites/minecraft/tile023.png'
	]
];

export default <Theme>{
	block_textures: {
		pieces: pieces_block_textures,
		others: other_block_textures
	},
	backgrounds: [
		{
			left: {
				picture:
					'https://user-images.githubusercontent.com/36163709/38576955-e4fdeda4-3cff-11e8-839f-e5d8f16bb63c.png'
			},
			right: {
				picture:
					'https://user-images.githubusercontent.com/36163709/38576955-e4fdeda4-3cff-11e8-839f-e5d8f16bb63c.png'
			}
		},
		{
			left: {
				_3d: {
					cube_size: 16,
					cubes: [Generator.background_uniform(other_block_textures[0], 1000)]
				}
			},
			right: {
				_3d: {
					cube_size: 16,
					cubes: [Generator.background_uniform(other_block_textures[0], 1000)]
				}
			}
		},
		{
			left: {
				_3d: {
					cube_size: 16,
					cubes: [
						Generator.background_chess(other_block_textures[0], other_block_textures[1], 1000)
					]
				}
			},
			right: {
				_3d: {
					cube_size: 16,
					cubes: [
						Generator.background_chess(other_block_textures[0], other_block_textures[1], 1000)
					]
				}
			}
		},
		{
			left: {
				_3d: {
					cube_size: 16,
					cubes: [Generator.background_holed_chess(other_block_textures[0], 1000)]
				}
			},
			right: {
				_3d: {
					cube_size: 16,
					cubes: [Generator.background_holed_chess(other_block_textures[0], 1000)]
				}
			}
		}
	]
};
