import Socket from './socket';
import NotificationStore from '../stores/notification';
import { nanoid } from 'nanoid';

export default function dash() {
	Socket.emit('game:concede', (ok: boolean) => {
		if (ok) {
			NotificationStore.push({
				id: nanoid(),
				message: `you concede`,
				error: false
			});
		} else {
			NotificationStore.push({
				id: nanoid(),
				message: `you can't concede`,
				error: true
			});
		}
	});
}
