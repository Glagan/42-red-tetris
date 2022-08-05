import isValidName from './Name';

describe('Name Validator', () => {
	it('Handle invalid input', () => {
		const value = undefined;
		expect(isValidName(value)).toBeFalsy();
	});

	it('Handle empty input', () => {
		const value = '';
		expect(isValidName(value)).toBeFalsy();
	});

	it('Handle trimmed input', () => {
		const value = '     ';
		expect(isValidName(value)).toBeFalsy();
	});

	it('Handle too long input', () => {
		const value = 'My Room is longer than 20 characters';
		expect(isValidName(value)).toBeFalsy();
	});

	it('Handle valid input', () => {
		const value = 'My Room';
		expect(isValidName(value)).toBeTruthy();
	});

	it('Handle trimmed valid input', () => {
		const value = 'My Rooooooooooooooom     ';
		expect(isValidName(value)).toBeTruthy();
	});
});
