import { writable } from 'svelte/store';

export const theme = writable<number>(0);
export default theme;
