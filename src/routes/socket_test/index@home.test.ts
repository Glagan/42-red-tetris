import { render, screen } from '@testing-library/svelte';
import Index from './index@home.svelte';

describe('Test index.svelte', () => {
	it('h1 exists', () => {
		const { getByText } = render(Index);
		expect(getByText('Welcome to SvelteKit')).toBeTruthy();
	});

	it('link to svelte website', () => {
		render(Index);

		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', 'https://kit.svelte.dev');
	});

	it('has rooms', () => {
		const { getByText } = render(Index);

		const rooms = getByText('Rooms');
		expect(rooms).toBeTruthy();
	});
});
