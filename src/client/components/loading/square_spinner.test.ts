import { render } from '@testing-library/svelte';
import Spinner from './square_spinner.svelte';

describe('Spinner', () => {
	it('Should display the spinner', () => {
		const { container } = render(Spinner);

		expect(container.querySelector('.square-spinner')).toBeTruthy();
	});
});
