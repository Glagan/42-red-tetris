import { nanoid } from 'nanoid';
import NotificationStore from '../../client/stores/notification';
import { goto } from '$app/navigation';
import UsernameStore from '../../client/stores/username';
import Socket from './socket';
import type { BasicError } from 'src/socket';
import * as Sounds from '../effects/sounds';
import { get } from 'svelte/store';

export default function username(username: string, callback: (() => void) | undefined = undefined) {
	if (get(UsernameStore) === username) {
		Sounds.ok();
		return goto('/search');
	}

	if (username.length > 0) {
		Socket.emit(
			'set:username',
			username,
			(success: boolean, error: BasicError | null | undefined) => {
				if (error != null && error != undefined) {
					NotificationStore.push({ id: nanoid(), message: error.message, error: true });
				} else {
					if (success) {
						Sounds.ok();
						localStorage.setItem('username', username);
						UsernameStore.set(username);
						NotificationStore.push({ id: nanoid(), message: 'username updated', error: false });
						goto('/search');
					} else {
						NotificationStore.push({
							id: nanoid(),
							message: 'username not updated',
							error: true
						});
					}
				}
				if (callback != undefined) callback();
			}
		);
	}
}
