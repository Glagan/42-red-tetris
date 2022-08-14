import { writable } from 'svelte/store';

/* c8 ignore next 2 */
export const level = writable<number>(0);
export default level;
