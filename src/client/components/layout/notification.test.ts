import { render } from '@testing-library/svelte';
import Notification from './notification.svelte';

describe('Notification', () => {
	it('Should display a notification', () => {
		const { container } = render(Notification, { message: 'Test message' });

		// The notification text should be visible
		expect(container.textContent).toBe('Test message');
	});
});
