import { writable } from 'svelte/store';

/* c8 ignore next 2 */
export const search = writable<string>('');
export default search;
