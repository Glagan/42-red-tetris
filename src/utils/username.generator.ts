import { v4 as uuidv4 } from 'uuid';

export default function username_generator(): string {
	return uuidv4().slice(24);
}
