import { render } from '@testing-library/svelte';
import Popup from './popup.svelte';

describe('Popup', () => {
	it('Should display the spinner', () => {
		const { container, getByText } = render(Popup);

		expect(container.querySelector('.central-box')).toBeTruthy();
		expect(getByText('Theme')).toBeTruthy();
		expect(getByText('Sound')).toBeTruthy();
	});
});
