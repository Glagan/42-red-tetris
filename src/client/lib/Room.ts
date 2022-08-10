import type { Player } from './Player';

export type Room = {
	id: string;
	name: string;
	players: Player[];
	playing: boolean;
};
export default Room;
