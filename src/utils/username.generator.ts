import { getRandomInt } from './random';

export default function username_generator(): string {
	return `Player#${getRandomInt(1000, 9999)}`;
}
