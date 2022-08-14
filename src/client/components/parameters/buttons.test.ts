import { render } from '@testing-library/svelte';
import Buttons from './buttons.svelte';

describe('Buttons', () => {
	it('Should display the spinner', () => {
		const { container } = render(Buttons);

		expect(container.querySelectorAll('button').length).toBe(2);
	});
});
