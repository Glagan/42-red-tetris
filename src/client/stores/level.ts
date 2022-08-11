import { writable } from 'svelte/store';

export const level = writable<number>(0);
export default level;
