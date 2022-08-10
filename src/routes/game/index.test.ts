import { render } from '@testing-library/svelte';
import Index from './index.svelte';

describe('Game page', () => {
	it('Should display the game page', () => {
		const { container } = render(Index);

		// Player info(s) and board(s)
		// expect(container.querySelector('.player-info')).toBeTruthy();
		expect(container.querySelector('.board-wrap')).toBeTruthy();
	});
});
