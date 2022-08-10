import { render } from '@testing-library/svelte';
import Index from './index.svelte';

describe('Search page', () => {
	it('Should display the search page', async () => {
		const { container, getByPlaceholderText } = render(Index);

		// Central boxes
		const centralBoxes = container.querySelectorAll('.central-box');
		expect(centralBoxes.length).toBe(2);

		// Setup and start search
		const searchInput = getByPlaceholderText('Search a game');
		expect(searchInput).toBeTruthy();
	});
});
