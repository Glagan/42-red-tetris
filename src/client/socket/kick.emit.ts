import socket from './socket';
import type { BasicError } from 'src/socket';
import notifications from '$client/stores/notification';
import { nanoid } from 'nanoid';

export default function dash() {
	socket.emit('room:kick', (kicked: boolean | null, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			notifications.push({ id: nanoid(), message: error.message, error: true });
		} else {
			notifications.push({
				id: nanoid(),
				message: `player ${kicked ? '' : 'not '}kicked`,
				error: false
			});
		}
	});
}
