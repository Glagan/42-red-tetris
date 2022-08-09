import { getRandomInt } from './random';

export default function usernameGenerator(): string {
	return `Player#${getRandomInt(1000, 9999)}`;
}
