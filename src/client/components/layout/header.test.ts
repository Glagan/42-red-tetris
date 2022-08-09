import { render } from '@testing-library/svelte';
import Header from './header.svelte';

describe('Header', () => {
	it('Should display the title', () => {
		const { container } = render(Header);

		// Player info(s) and board(s)
		expect(container.textContent).toBe('T E T R I S 3D');
	});
});
