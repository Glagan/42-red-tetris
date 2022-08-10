<!-- ========================= SCRIPT -->
<script lang="ts">
	import Boards from './boards.svelte';
	import PlayerInfo from './player_info.svelte';
	import WinnerStore from '../../client/stores/winner';
	import CurrentRoomStore from '../../client/stores/currentRoom';
	import { browser } from '$app/env';
	import * as Move from '../../client/socket/move.emit';
	import Rotate from '../../client/socket/rotate.emit';
	import Dash from '../../client/socket/dash.emit';
	import GameOver from './game_over.svelte';

	if (browser) {
		document.onkeypress = function (event) {
			const char = event?.keyCode;
			if (char != undefined) {
				switch (char) {
					case 97:
						Move.left();
						break;
					case 100:
						Move.right();
						break;
					case 32:
						Dash();
						break;
					case 115:
						Move.down();
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

<GameOver />
<div class="game h-full flex flex-col justify-center" class:transparant={$WinnerStore != -1}>
	<div class="h-fit">
		<div class="flex flex-row justify-around">
			<PlayerInfo horizontal_alignement={-1} player={$CurrentRoomStore?.players[0]} />
			<PlayerInfo horizontal_alignement={1} player={$CurrentRoomStore?.players[1]} />
		</div>
		<Boards />
	</div>
</div>

<!-- ========================= CSS -->
<style lang="postcss">
	.game {
		margin-top: calc(var(--header-height) / 1.4);
		/* @apply absolute;
		top: 50%; */
	}
</style>
