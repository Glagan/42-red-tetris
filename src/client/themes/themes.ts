import MinecraftAllThemes from './categories/minecraft';
import TetrisAllThemes from './categories/tetris';
import type Theme from '../lib/Theme';

export default <Theme[]>[...TetrisAllThemes, ...MinecraftAllThemes];
