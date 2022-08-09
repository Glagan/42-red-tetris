import { writable } from 'svelte/store';
import type _Notification from '../lib/Notification';

const initial: _Notification[] = [];

function createUsernameStore() {
	const { subscribe, update } = writable(initial);

	return {
		subscribe,
		push: (notification: _Notification) =>
			update((notifications) => {
				notifications.push(notification);
				return notifications;
			})
	};
}

export default createUsernameStore();
