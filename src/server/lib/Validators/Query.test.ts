import isValidQuery from './Query';

describe('Query Validator', () => {
	it('Handle invalid input', () => {
		const value = undefined;
		expect(isValidQuery(value)).toBeFalsy();
	});

	it('Handle empty input', () => {
		const value = '';
		expect(isValidQuery(value)).toBeFalsy();
	});

	it('Handle trimmed input', () => {
		const value = '     ';
		expect(isValidQuery(value)).toBeFalsy();
	});

	it('Handle too long input', () => {
		const value = 'My Rooooooooooooooooom is longer than 50 characters';
		expect(isValidQuery(value)).toBeFalsy();
	});

	it('Handle valid input', () => {
		const value = 'My Room';
		expect(isValidQuery(value)).toBeTruthy();
	});

	it('Handle trimmed valid input', () => {
		const value = 'My Roooooooooooooooooooom is exactly 50 characters       ';
		expect(isValidQuery(value)).toBeTruthy();
	});
});
