import { writable } from 'svelte/store';

/* c8 ignore next 2 */
export const matchmaking = writable<boolean>(false);
export default matchmaking;
