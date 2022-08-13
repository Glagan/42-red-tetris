import { writable } from 'svelte/store';

export const search = writable<string>('');
export default search;
