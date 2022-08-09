import { nanoid } from 'nanoid';
import { roomMatchAny } from './Match';

describe('Test Match function', () => {
	it("Full room doesn't match", async () => {
		const room = {
			id: nanoid(),
			name: 'Room',
			players: [
				{
					id: nanoid(),
					name: 'Player'
				},
				{
					id: nanoid(),
					name: 'Player'
				}
			]
		};
		expect(roomMatchAny(room, '')).toBeFalsy();
	});

	it('Match by name', async () => {
		const room = {
			id: nanoid(),
			name: 'Room',
			players: [
				{
					id: nanoid(),
					name: 'Player'
				}
			]
		};
		expect(roomMatchAny(room, 'Room')).toBeTruthy();
	});

	it('Match by room id', async () => {
		const roomId = nanoid();
		const room = {
			id: roomId,
			name: 'Room',
			players: [
				{
					id: nanoid(),
					name: 'Player'
				}
			]
		};
		expect(roomMatchAny(room, roomId)).toBeTruthy();
	});

	it('Match by player id', async () => {
		const playerId = nanoid();
		const room = {
			id: nanoid(),
			name: 'Room',
			players: [
				{
					id: playerId,
					name: 'Player'
				}
			]
		};
		expect(roomMatchAny(room, playerId)).toBeTruthy();
	});

	it('Match by player name', async () => {
		const room = {
			id: nanoid(),
			name: 'Room',
			players: [
				{
					id: nanoid(),
					name: 'Player'
				}
			]
		};
		expect(roomMatchAny(room, 'Player')).toBeTruthy();
	});
});
