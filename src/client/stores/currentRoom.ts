import { writable } from 'svelte/store';
import type { Room } from '../../client/lib/Room';

export const currentRoom = writable<Room | null>(null);
export default currentRoom;
