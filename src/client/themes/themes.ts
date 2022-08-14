import MinecraftAllThemes from './categories/minecraft';
import TetrisAllThemes from './categories/tetris';
import type Theme from '$client/lib/Theme';

export default <Theme[]>[...TetrisAllThemes, ...MinecraftAllThemes];
