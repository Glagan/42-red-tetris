import { nanoid } from 'nanoid';
import notifications from '$client/stores/notification';
import rooms from '$client/stores/rooms';
import type { BasicError } from 'src/socket';
import socket from './socket';
import type Room from '$client/lib/Room';

export default function search(search: string, callback: (() => void) | undefined = undefined) {
	socket.emit('room:search', search, (results: Room[], error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			notifications.push({ id: nanoid(), message: error.message, error: true });
		} else {
			rooms.set(results);
		}
		if (callback != undefined) callback();
	});
}
