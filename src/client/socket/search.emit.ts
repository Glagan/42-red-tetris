import { nanoid } from 'nanoid';
import NotificationStore from '../../client/stores/notification';
import RoomsStore from '../../client/stores/rooms';
import type { BasicError } from 'src/socket';
import Socket from './socket';
import type Room from '../lib/Room';

export default function search(search: string, callback: (() => void) | undefined = undefined) {
	Socket.emit('room:search', search, (rooms: Room[], error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			NotificationStore.push({ id: nanoid(), message: error.message, error: true });
		} else {
			RoomsStore.set(rooms);
		}
		if (callback != undefined) callback();
	});
}
