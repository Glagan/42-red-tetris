import { v4 as uuidv4 } from 'uuid';
import NotificationStore from '../../client/stores/notification';
import CurrentRoomStore from '../../client/stores/currentRoom';
import type { BasicError } from 'src/socket';
import type Room from '../lib/Room';
import { goto } from '$app/navigation';
import Socket from './socket';

export default function create(create: string, callback: (() => void) | undefined = undefined) {
	Socket.emit('room:create', create, (room: Room | null, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			NotificationStore.push({ id: uuidv4(), message: error.message, error: true });
		} else {
			if (room != null) {
				CurrentRoomStore.set(room);
				NotificationStore.push({ id: uuidv4(), message: 'room created', error: false });
				goto('/room');
			} else {
				NotificationStore.push({
					id: uuidv4(),
					message: 'room not created',
					error: true
				});
			}
		}
		if (callback != undefined) callback();
	});
}
