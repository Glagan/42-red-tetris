import { nanoid } from 'nanoid';
import notifications from '$client/stores/notification';
import type { BasicError } from 'src/socket';
import socket from './socket';

export default function ready(callback: ((value: boolean) => void) | undefined = undefined) {
	socket.emit('room:ready', (ready: boolean, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			notifications.push({ id: nanoid(), message: error.message, error: true });
		} else {
			notifications.push({
				id: nanoid(),
				message: (ready ? '' : 'not ') + 'ready',
				error: false
			});
		}
		if (callback != undefined) callback(ready);
	});
}
