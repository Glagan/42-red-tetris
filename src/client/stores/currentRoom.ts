import { writable } from 'svelte/store';

export const currentRoom = writable<string>('');
export default currentRoom;
