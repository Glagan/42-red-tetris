import type Room from '$client/lib/Room';
import { writable } from 'svelte/store';

export const rooms = writable<Room[]>([]);
export default rooms;
