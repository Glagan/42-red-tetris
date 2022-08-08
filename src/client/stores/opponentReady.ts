import { writable } from 'svelte/store';

export const rooms = writable<boolean>(false);
export default rooms;
