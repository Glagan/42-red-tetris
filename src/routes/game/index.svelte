<!-- ========================= SCRIPT -->
<script lang="ts">
	import Boards from '$components/game/boards.svelte';
	import winner from '$client/stores/winner';
	import boards from '$client/stores/boards';
	import { browser } from '$app/env';
	import * as Move from '$client/socket/move.emit';
	import Rotate from '$client/socket/rotate.emit';
	import Dash from '$client/socket/dash.emit';
	import GameOver from '$components/game/game-over.svelte';
	import PlayerInfos from '$components/game/player-infos.svelte';
	import { onDestroy, onMount, tick } from 'svelte';

	$: solo = $boards[1].length === 0;

	if (browser) {
		const onKeyDown = (event: KeyboardEvent) => {
			const key = event.key;
			if (key != undefined) {
				switch (key) {
					case 'a':
					case 'q':
					case 'ArrowLeft':
						event.preventDefault();
						Move.left();
						break;
					case 'd':
					case 'ArrowRight':
						event.preventDefault();
						Move.right();
						break;
					case ' ':
					case 'Space':
						event.preventDefault();
						Dash();
						break;
					case 's':
					case 'ArrowDown':
						event.preventDefault();
						Move.down();
						break;
					case 'w':
					case 'z':
					case 'ArrowUp':
						event.preventDefault();
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

		onMount(async () => {
			await tick();
			window.scrollTo(0, document.body.scrollHeight);
		});
	}
</script>

<!-- ========================= HTML -->

<GameOver />
<div
	class="game relative flex flex-col justify-center h-fit mb-4"
	class:transparant={$winner != -1}
>
	<PlayerInfos {solo} />
	<Boards {solo} />
</div>

<!-- ========================= CSS -->
<style lang="postcss">
	.game {
		margin-top: calc(var(--header-height) / 1.4);
	}
</style>
