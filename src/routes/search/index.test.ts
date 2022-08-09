import { render } from '@testing-library/svelte';
import Index from './index.svelte';

describe('Search page', () => {
	it('Should display the matchmaking page', () => {
		const { container } = render(Index);

		// Central box
		const centralBox = container.querySelector('.central-box');
		expect(centralBox).toBeTruthy();
		expect(centralBox?.querySelector('.square-spinner')).toBeTruthy();
	});
});
