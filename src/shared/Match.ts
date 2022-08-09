export function roomMatchAny(
	room: {
		id: string;
		name: string;
		players: {
			id: string;
			name: string;
		}[];
	},
	query: string
) {
	if (room.players.length >= 2) {
		return false;
	}
	const parts = query.trim().split(' ');
	for (const part of parts) {
		if (
			part != '' &&
			(room.id == part ||
				room.name.indexOf(part) >= 0 ||
				room.id === part ||
				room.players.findIndex((player) => player.id === part || player.name.indexOf(part) >= 0) >=
					0)
		) {
			return true;
		}
	}
	return false;
}
