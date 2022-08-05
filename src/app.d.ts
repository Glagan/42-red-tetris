// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type Player from '$server/lib/Player';

// and what to do when importing types
declare namespace App {
	interface Locals {
		id: string;
	}

	// interface Platform {}
	// interface PrivateEnv {}
	// interface PublicEnv {}
	// interface Session {}
	// interface Stuff {}
}

declare module 'socket.io' {
	interface Socket {
		player: Player;
	}
}
