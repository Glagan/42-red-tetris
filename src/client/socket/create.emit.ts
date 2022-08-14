import { nanoid } from 'nanoid';
import NotificationStore from '$client/stores/notification';
import CurrentRoomStore from '$client/stores/currentRoom';
import WinnerStore from '$client/stores/winner';
import type { BasicError } from 'src/socket';
import type Room from '$client/lib/Room';
import { goto } from '$app/navigation';
import Socket from './socket';

export default function create(
	create: string,
	callback: ((ok: boolean) => void) | undefined = undefined
) {
	let ok = false;

	Socket.emit('room:create', create, (room: Room | null, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			NotificationStore.push({ id: nanoid(), message: error.message, error: true });
		} else {
			if (room != null) {
				ok = true;
				CurrentRoomStore.set(room);
				WinnerStore.remove();
				NotificationStore.push({ id: nanoid(), message: 'room created', error: false });
				goto('/room');
			} else {
				NotificationStore.push({
					id: nanoid(),
					message: 'room not created',
					error: true
				});
			}
		}
		if (callback != undefined) callback(ok);
	});
}
