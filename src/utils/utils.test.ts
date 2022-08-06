import { getRandomInt } from './random';
import sleep from './sleep';

describe('Test Utils', () => {
	it('Can get a random int', () => {
		for (let index = 0; index < 100; index++) {
			expect(getRandomInt(1, 100)).toBeTruthy();
		}
	});

	it('Sleep correctly return a promise', async () => {
		expect(sleep(1)).toBeInstanceOf(Promise);
		expect(await sleep(1)).toBeTruthy();
	});
});
