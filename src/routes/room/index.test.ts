import currentRoom from '$client/stores/currentRoom';
import { render } from '@testing-library/svelte';
import { nanoid } from 'nanoid';
import Index from './index.svelte';

describe('Room page', () => {
	it('Should display the room page', () => {
		// Set a current room to avoid redirections
		const roomId = nanoid();
		currentRoom.set({
			id: roomId,
			name: 'My room',
			players: [
				{
					id: nanoid(),
					name: 'Test',
					status: true,
					room: roomId
				}
			],
			playing: false
		});

		const { container } = render(Index);

		// Central box
		const centralBox = container.querySelector('.central-box');
		expect(centralBox).toBeTruthy();
	});
});
