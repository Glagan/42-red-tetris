import type { Player } from './Player';

export type Room = {
	id: string;
	name: string;
	players: Player[];
};
export default Room;
