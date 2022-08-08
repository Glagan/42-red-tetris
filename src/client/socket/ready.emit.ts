import { v4 as uuidv4 } from 'uuid';
import NotificationStore from '../../client/stores/notification';
import type { BasicError } from 'src/socket';
import Socket from './socket';

export default function ready(callback: ((new_ready: boolean) => void) | undefined = undefined) {
	Socket.emit('room:ready', (ready: boolean, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			NotificationStore.push({ id: uuidv4(), message: error.message, error: true });
		} else {
			NotificationStore.push({
				id: uuidv4(),
				message: (ready ? '' : 'not ') + 'ready',
				error: false
			});
		}
		if (callback != undefined) callback(ready);
	});
}
