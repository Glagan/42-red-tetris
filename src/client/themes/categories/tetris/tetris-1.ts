import type Theme from '$client/lib/Theme';
import * as Generator from '$client/themes/generators/background';

const pieces_block_textures = [
	[
		// 0
		'/sprites/tetris/Level1/i.png'
	],
	[
		// 1
		'/sprites/tetris/Level1/j.png'
	],
	[
		// 2
		'/sprites/tetris/Level1/l.png'
	],
	[
		// 3
		'/sprites/tetris/Level1/o.png'
	],
	[
		// 4
		'/sprites/tetris/Level1/s.png'
	],
	[
		// 5
		'/sprites/tetris/Level1/t.png'
	],
	[
		// 6
		'/sprites/tetris/Level1/z.png'
	],
	[
		// 7
		'/sprites/tetris/b.png'
	]
];

const other_block_textures = [
	[
		// 0 Obsidian
		'/sprites/tetris/background.png'
	]
];

export default <Theme>{
	name: 'tetris 1',
	blockTextures: {
		pieces: pieces_block_textures,
		others: other_block_textures
	},
	background: {
		left: {
			_3d: {
				cubeSize: 16,
				cubes: [Generator.backgroundUniform(other_block_textures[0], 1000)]
			},
			brightness: 100
		},
		right: {
			_3d: {
				cubeSize: 16,
				cubes: [Generator.backgroundUniform(other_block_textures[0], 1000)]
			},
			brightness: 100
		}
	}
};
