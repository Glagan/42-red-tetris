import type Theme from '$client/lib/Theme';
import * as Generator from '$client/themes/generators/background';

const pieces_block_textures = [
	[
		// 0
		'/sprites/tetris/Level9/i.png'
	],
	[
		// 1
		'/sprites/tetris/Level9/j.png'
	],
	[
		// 2
		'/sprites/tetris/Level9/l.png'
	],
	[
		// 3
		'/sprites/tetris/Level9/o.png'
	],
	[
		// 4
		'/sprites/tetris/Level9/s.png'
	],
	[
		// 5
		'/sprites/tetris/Level9/t.png'
	],
	[
		// 6
		'/sprites/tetris/Level9/z.png'
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
	name: 'Tetris 9',
	block_textures: {
		pieces: pieces_block_textures,
		others: other_block_textures
	},
	background: {
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
	}
};
