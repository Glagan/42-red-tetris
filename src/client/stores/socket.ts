import { writable } from 'svelte/store';

/* c8 ignore next 2 */
export const playerSocket = writable<string>('');
export default playerSocket;
