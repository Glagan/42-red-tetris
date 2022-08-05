import { nanoid } from 'nanoid';
import isValidID from './ID';

describe('ID Validator', () => {
	it('Handle invalid input', () => {
		const value = undefined;
		expect(isValidID(value)).toBeFalsy();
	});

	it('Handle empty input', () => {
		const value = '';
		expect(isValidID(value)).toBeFalsy();
	});

	it('Handle incomplete input', () => {
		const value = 'token';
		expect(isValidID(value)).toBeFalsy();
	});

	it('Handle valid input', () => {
		const value = nanoid();
		expect(isValidID(value)).toBeTruthy();
	});
});
