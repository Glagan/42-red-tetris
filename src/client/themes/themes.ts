import MinecraftAllThemes from './categories/minecraft/minecraft_all';
import TetrisAllThemes from './categories/tetris/tetris_all';
import type Theme from '../lib/Theme';

export default <Theme[]>[...MinecraftAllThemes, ...TetrisAllThemes];
