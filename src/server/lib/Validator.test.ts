import type { CreateRoomPayload } from '$server/events/room';
import { objectOf } from '@altostra/type-validations';
import { validatePayload } from './Validator';
import isValidName from './Validators/Name';

describe('Validators', () => {
	it('Can detect an invalid payload', () => {
		const name = '';

		expect(
			validatePayload(
				{ name },
				objectOf<CreateRoomPayload>({
					name: isValidName
				})
			)
		).toBeFalsy();
	});

	it('Can detect a valid payload', () => {
		const name = 'My Room';

		expect(
			validatePayload(
				{ name },
				objectOf<CreateRoomPayload>({
					name: isValidName
				})
			)
		).toBeTruthy();
	});
});
