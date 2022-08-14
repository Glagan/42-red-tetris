export default function parseUrlHash(hash: string): { room: string; username: string } | null {
	// check #
	if (hash.length === 0 || hash[0] != '#') return null;

	// split the hash
	const hashSplit = hash.slice(1).split('[');

	// check hashSplit length
	if (hashSplit.length != 2) return null;

	// check room length
	const roomLength = hashSplit[0].length;
	if (roomLength === 0) return null;

	// check username length
	const usernameLength = hashSplit[1].length;
	if (usernameLength === 0 || hashSplit[1].charAt(usernameLength - 1) != ']') return null;

	return {
		room: hashSplit[0],
		username: hashSplit[1].slice(0, -1)
	};
}
