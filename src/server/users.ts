import type { DateTime } from 'luxon';
import type Player from '$server/lib/Player';

// References to User given a token
export const socketUsers: Record<
	string,
	{
		player: Player;
		lastUpdate: DateTime;
	}
> = {};
// References to User token given a socket ID
export const socketUserReferences: Record<string, string> = {};
