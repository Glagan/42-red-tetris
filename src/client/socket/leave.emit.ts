import { nanoid } from 'nanoid';
import NotificationStore from '../../client/stores/notification';
import CurrentRoomStore from '../../client/stores/currentRoom';
import type { BasicError } from 'src/socket';
import { goto } from '$app/navigation';
import Socket from './socket';

export function leave_room(callback: (() => void) | undefined = undefined) {
	Socket.emit('room:leave', (deleted: boolean | null, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			NotificationStore.push({ id: nanoid(), message: error.message, error: true });
		} else {
			CurrentRoomStore.set(null);
			NotificationStore.push({
				id: nanoid(),
				message: `room ${deleted ? 'deleted' : 'leaved'}`,
				error: false
			});
			goto('/search');
		}
		if (callback != undefined) callback();
	});
}

export function leave_matchmaking(callback: (() => void) | undefined = undefined) {
	Socket.emit(
		'matchmaking:leave',
		(success: boolean | null, error: BasicError | null | undefined) => {
			if (error != null && error != undefined) {
				NotificationStore.push({ id: nanoid(), message: error.message, error: true });
			} else if (success) {
				NotificationStore.push({
					id: nanoid(),
					message: 'matchmaking leaved',
					error: false
				});
				goto('/search');
			} else {
				NotificationStore.push({
					id: nanoid(),
					message: 'matchmaking not leaved',
					error: false
				});
			}
			if (callback != undefined) callback();
			return;
		}
	);
}
