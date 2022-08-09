import idGenerator from './id.generator';
import { getRandomInt } from './random';
import sleep from './sleep';
import usernameGenerator from './username.generator';

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

	it('ID generator returns a number', async () => {
		const id = idGenerator([1, 2, 3]);
		expect(typeof id === 'number').toBeTruthy();
	});

	it('Username generator generate the correct pattern', async () => {
		const username = usernameGenerator();
		expect(username.match(/Player#\d{4}/)).toBeTruthy();
	});
});
