import { writable } from 'svelte/store';

export const username = writable<string>('');
export default username;
