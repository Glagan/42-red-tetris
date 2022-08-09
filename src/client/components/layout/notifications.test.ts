import { nanoid } from 'nanoid';
import { render } from '@testing-library/svelte';
import Notifications from './notifications.svelte';
import NotificationStore from '../../stores/notification';

describe('Notifications', () => {
	it('Should display all notifications', () => {
		NotificationStore.push({ id: nanoid(), message: 'Test success notification', error: false });
		NotificationStore.push({ id: nanoid(), message: 'Test error notification', error: true });
		const { getByText } = render(Notifications);

		// The notification text should be visible
		expect(getByText('Test success notification')).toBeTruthy();
		expect(getByText('Test error notification')).toBeTruthy();
	});
});
