import socket from './socket';
import notifications from '$client/stores/notification';
import { nanoid } from 'nanoid';

export default function dash() {
	socket.emit('game:concede', (ok: boolean) => {
		if (ok) {
			notifications.push({
				id: nanoid(),
				message: `you concede`,
				error: false
			});
		} else {
			notifications.push({
				id: nanoid(),
				message: `you can't concede`,
				error: true
			});
		}
	});
}
