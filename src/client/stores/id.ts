import { writable } from 'svelte/store';

/* c8 ignore next 2 */
export const username = writable<string>('');
export default username;
