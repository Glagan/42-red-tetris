import currentRoom from '$client/stores/currentRoom';
import { render } from '@testing-library/svelte';
import { nanoid } from 'nanoid';
import Index from './index.svelte';

describe('Matchmaking page', () => {
	it('Should display the matchmaking page', () => {
		// Set a current room to avoid redirections
		currentRoom.set({
			id: nanoid(),
			name: 'My room',
			players: []
		});

		const { container } = render(Index);

		// Central box
		const centralBox = container.querySelector('.central-box');
		expect(centralBox).toBeTruthy();
		expect(centralBox?.querySelector('.square-spinner')).toBeTruthy();
	});
});
