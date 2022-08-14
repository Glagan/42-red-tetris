export default function parseUrlHash(url_hash: string): { room: string; username: string } | null {
	// check #
	if (url_hash.length === 0 || url_hash[0] != '#') return null;

	// split the hash
	const hash_split = url_hash.slice(1).split('[');

	// check hash_split length
	if (hash_split.length != 2) return null;

	// check room length
	const room_length = hash_split[0].length;
	if (room_length === 0) return null;

	// check username length
	const username_length = hash_split[1].length;
	if (username_length === 0 || hash_split[1].charAt(username_length - 1) != ']') return null;

	return {
		room: hash_split[0],
		username: hash_split[1].slice(0, -1)
	};
}
