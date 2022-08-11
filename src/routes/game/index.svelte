<!-- ========================= SCRIPT -->
<script lang="ts">
	import Boards from './boards.svelte';
	import WinnerStore from '../../client/stores/winner';
	import BoardsStore from '../../client/stores/boards';
	import { browser } from '$app/env';
	import * as Move from '../../client/socket/move.emit';
	import Rotate from '../../client/socket/rotate.emit';
	import Dash from '../../client/socket/dash.emit';
	import GameOver from './game_over.svelte';
	import PlayerInfos from './player_infos.svelte';
	import { onDestroy } from 'svelte';

	$: solo = $BoardsStore[1].length === 0;

	if (browser) {
		const onKeyDown = (event: KeyboardEvent) => {
			const key = event.key;
			if (key != undefined) {
				switch (key) {
					case 'a':
					case 'q':
					case 'ArrowLeft':
						Move.left();
						break;
					case 'd':
					case 'ArrowRight':
						Move.right();
						break;
					case ' ':
					case 'Space':
						Dash();
						break;
					case 's':
					case 'ArrowDown':
						Move.down();
						break;
					case 'w':
					case 'z':
					case 'ArrowUp':
						Rotate(true);
						break;
					case 'e':
						Rotate(false);
						break;
				}
			}
		};

		document.addEventListener('keydown', onKeyDown);

		onDestroy(() => {
			document.removeEventListener('keydown', onKeyDown);
		});
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
