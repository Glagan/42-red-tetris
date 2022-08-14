import { writable } from 'svelte/store';

/* c8 ignore next 2 */
export const rooms = writable<boolean>(false);
export default rooms;
