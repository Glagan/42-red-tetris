import { writable } from 'svelte/store';
import type Theme from '../lib/Theme';
import MinecraftTheme from '../themes/minecraft';

export const theme = writable<Theme>(MinecraftTheme);
export default theme;
