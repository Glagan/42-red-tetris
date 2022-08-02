import { nanoid } from 'nanoid';

export default class Player {
	id: string;
	name: string;

	constructor(name: string) {
		this.id = nanoid();
		this.name = name;
	}
}
