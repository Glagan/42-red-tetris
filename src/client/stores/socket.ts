import { writable } from 'svelte/store';

/* c8 ignore next 2 */
export const currentRoom = writable<string>('');
export default currentRoom;
