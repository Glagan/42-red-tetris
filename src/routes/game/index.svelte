<!-- ========================= SCRIPT -->
<script lang="ts">
	import Boards from './boards.svelte';
	import WinnerStore from '../../client/stores/winner';
	import CurrentRoomStore from '../../client/stores/currentRoom';
	import BoardsStore from '../../client/stores/boards';
	import { browser } from '$app/env';
	import * as Move from '../../client/socket/move.emit';
	import Rotate from '../../client/socket/rotate.emit';
	import Dash from '../../client/socket/dash.emit';
	import GameOver from './game_over.svelte';
	import PlayerInfos from './player_infos.svelte';

	$: solo = $BoardsStore[1].length === 0;

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
<div class="game flex flex-col justify-center h-fit" class:transparant={$WinnerStore != -1}>
	<PlayerInfos {solo} />
	<Boards {solo} />
</div>

<!-- ========================= CSS -->
<style lang="postcss">
	.game {
		margin-top: calc(var(--header-height) / 1.4);
	}
</style>
