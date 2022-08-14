import { writable } from 'svelte/store';

/* c8 ignore next 2 */
export const playerId = writable<string>('');
export default playerId;
