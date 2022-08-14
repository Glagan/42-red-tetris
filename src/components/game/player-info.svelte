<!-- ========================= SCRIPT -->
<script lang="ts">
	import type Player from '$client/lib/Player';
	import scores from '$client/stores/scores';
	import id from '$client/stores/id';
	import winner from '$client/stores/winner';
	import level from '$client/stores/level';
	import NextPieces from './next-pieces.svelte';
	import Concede from '$client/socket/concede.emit';
	import * as Sounds from '$client/effects/sounds';

	export let player: Player | undefined = undefined;
	export let horizontalAlignement: -1 | 0 | 1 = 0; // -1:left | 0:center | 1:right

	$: self = player?.id === $id;
	$: gameOver = $winner != -1;

	let playerIndex: 0 | 1;
	$: playerIndex = horizontalAlignement == 1 ? 1 : 0;
	$: playerName = player == undefined ? '?' : player.name;
	$: levelSide = playerIndex === 0 ? 'right' : 'left';
</script>

<!-- ========================= HTML -->
<div
	class="relative bg-neutral-900 p-3 w-[260px] m-auto mt-3"
	style={horizontalAlignement != 0
		? `transform: rotateY(10deg) rotateX(${-horizontalAlignement * 30}deg);`
		: ''}
>
	{#if self}
		<button
			class:cant-click={gameOver}
			class="icon not-hover absolute -top-3 -left-3 -rotate-12 w-8 scale-hover p-2 z-[100000000]"
			on:click={() => {
				if (!gameOver) {
					Sounds.cancel();
					Concede();
				}
			}}
			tabindex="-1"
		>
			<img src="/icons/flag.png" alt="parameters icon" />
		</button>
	{/if}
	<div class="flex justify-between">
		<p class="w-1/2 align-top">
			<span class="inline-block align-top truncate w-1/2">{playerName}</span>
			{#if self}
				<span class="align-top text-neutral-500"> (you)</span>
			{/if}
		</p>
		<p class="truncate w-1/2">Score: <span>{$scores[playerIndex]}</span></p>
	</div>
	<NextPieces player={playerIndex} />
	<p class="level-{levelSide} select-none absolute block w-0 h-0 bottom-2 -rotate-90">
		{#each new Array($level).fill('>') as level, index}
			<span style="opacity: {1 / 5 + index / 5};">{level}</span>
		{/each}
	</p>
</div>

<!-- ========================= CSS -->
<style lang="postcss">
	.level-left {
		@apply -left-[16px];
	}

	.level-right {
		@apply right-[9px];
	}

	p {
		@apply inline-block px-1;
	}
</style>
