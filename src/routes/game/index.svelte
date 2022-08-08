<!-- ========================= SCRIPT -->
<script lang="ts">
	import Boards from './boards.svelte';
	import PlayerInfo from './player_info.svelte';
	import { browser } from '$app/env';
	import Move from '../../client/socket/move.emit';
	import Rotate from '../../client/socket/rotate.emit';
	import Dash from '../../client/socket/dash.emit';

	if (browser) {
		document.onkeypress = function (event) {
			const char = event?.keyCode;
			console.log(char);
			if (char != undefined) {
				switch (char) {
					case 97:
						Move(false);
						break;
					case 100:
						Move(true);
						break;
					case 115:
						Dash();
						break;
					case 119:
						Rotate(true);
						break;
				}
			}
		};
	}
</script>

<!-- ========================= HTML -->
<div class="w-fit m-auto mt-5 mb-3">
	<div class="flex flex-row justify-around">
		<PlayerInfo />
		<PlayerInfo />
	</div>
	<Boards />
</div>
