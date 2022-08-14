import { writable } from 'svelte/store';

/* c8 ignore next 2 */
export const theme = writable<number>(0);
export default theme;
