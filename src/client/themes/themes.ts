import type Theme from '$client/lib/Theme';
import TetrisAllThemes from './categories/tetris';
import TempleAllThemes from './categories/temple';
import MinecraftAllThemes from './categories/minecraft';

export default <Theme[]>[...TetrisAllThemes, ...TempleAllThemes, ...MinecraftAllThemes];
