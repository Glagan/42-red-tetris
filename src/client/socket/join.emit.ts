import { nanoid } from 'nanoid';
import NotificationStore from '../../client/stores/notification';
import CurrentRoomStore from '../../client/stores/currentRoom';
import MatchmakingStore from '../../client/stores/matchmaking';
import WinnerStore from '../../client/stores/winner';
import type { BasicError } from 'src/socket';
import type Room from '../lib/Room';
import { goto } from '$app/navigation';
import Socket from './socket';

export function join_room(id: string, callback: (() => void) | undefined = undefined) {
	Socket.emit('room:join', id, (room: Room | null, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			NotificationStore.push({ id: nanoid(), message: error.message, error: true });
		} else {
			if (room != null) {
				CurrentRoomStore.set(room);
				WinnerStore.remove();
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

export function join_matchmaking(callback: (() => void) | undefined = undefined) {
	Socket.emit('matchmaking:join', (success: boolean, error: BasicError | null | undefined) => {
		if (error != null && error != undefined) {
			NotificationStore.push({ id: nanoid(), message: error.message, error: true });
		} else if (success) {
			NotificationStore.push({
				id: nanoid(),
				message: 'matchmaking start',
				error: false
			});
			MatchmakingStore.set(true);
			goto('/matchmaking');
		} else {
			NotificationStore.push({
				id: nanoid(),
				message: 'matchmaking not start',
				error: false
			});
		}
		if (callback != undefined) callback();
		return;
	});
}
