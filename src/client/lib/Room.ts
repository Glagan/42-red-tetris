import type { Player } from './Player';

export type Room = {
	id: string;
	name: string;
	players: Player[];
	createdAt: string;
	lastUpdate: string;
};
export default Room;
