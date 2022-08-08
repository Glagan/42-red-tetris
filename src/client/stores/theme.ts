import { writable } from 'svelte/store';
import type ThemeInfo from '../themes/theme.info';
import MinecraftTheme from '../themes/minecraft';

export const theme = writable<ThemeInfo>(MinecraftTheme);
export default theme;
