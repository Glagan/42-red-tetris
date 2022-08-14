import { writable } from 'svelte/store';
import type _Notification from '$client/lib/Notification';
import * as Sounds from '$client/effects/sounds';

const initial: _Notification[] = [];

function createUsernameStore() {
	const { subscribe, update } = writable(initial);

	return {
		subscribe,
		push: (notification: _Notification) =>
			update((notifications) => {
				if (notification.error) Sounds.error();
				notifications.push(notification);
				return notifications;
			})
	};
}

export default createUsernameStore();
