import Socket from './socket';
import type { BasicError } from 'src/socket';
import NotificationStore from '$client/stores/notification';
import { nanoid } from 'nanoid';

export default function dash() {
	Socket.emit('room:kick', (kicked: boolean | null, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			NotificationStore.push({ id: nanoid(), message: error.message, error: true });
		} else {
			NotificationStore.push({
				id: nanoid(),
				message: `player ${kicked ? '' : 'not '}kicked`,
				error: false
			});
		}
	});
}
