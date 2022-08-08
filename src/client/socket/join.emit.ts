import { nanoid } from 'nanoid';
import NotificationStore from '../../client/stores/notification';
import CurrentRoomStore from '../../client/stores/currentRoom';
import type { BasicError } from 'src/socket';
import type Room from '../lib/Room';
import { goto } from '$app/navigation';
import Socket from './socket';

export default function join(id: string, callback: (() => void) | undefined = undefined) {
	Socket.emit('room:join', id, (room: Room | null, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			NotificationStore.push({ id: nanoid(), message: error.message, error: true });
		} else {
			if (room != null) {
				CurrentRoomStore.set(room);
				NotificationStore.push({ id: nanoid(), message: 'room joined', error: false });
				goto('/room');
			} else {
				NotificationStore.push({
					id: nanoid(),
					message: 'room not joined',
					error: true
				});
			}
		}
		if (callback != undefined) callback();
	});
}
