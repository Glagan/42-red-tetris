import { writable } from 'svelte/store';

export const matchmaking = writable<boolean>(false);
export default matchmaking;
