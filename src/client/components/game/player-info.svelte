<!-- ========================= SCRIPT -->
<script lang="ts">
	import type Player from '$client/lib/Player';
	import ScoresStore from '$client/stores/scores';
	import IdStore from '$client/stores/id';
	import WinnerStore from '$client/stores/winner';
	import LevelStore from '$client/stores/level';
	import NextPieces from './next-pieces.svelte';
	import Concede from '$client/socket/concede.emit';
	import * as Sounds from '$client/effects/sounds';

	export let player: Player | undefined = undefined;
	export let horizontal_alignement: -1 | 0 | 1 = 0; // -1:left | 0:center | 1:right

	$: its_me = player?.id === $IdStore;
	$: game_over = $WinnerStore != -1;

	let player_number: 0 | 1;
	$: player_number = horizontal_alignement == 1 ? 1 : 0;
	$: player_name = player == undefined ? '?' : player.name;
	$: level_side = player_number === 0 ? 'right' : 'left';
</script>

<!-- ========================= HTML -->
<div
	class="relative bg-neutral-900 p-3 w-[260px] m-auto mt-3"
	style={horizontal_alignement != 0
		? `transform: rotateY(10deg) rotateX(${-horizontal_alignement * 30}deg);`
		: ''}
>
	{#if its_me}
		<button
			class:cant-click={game_over}
			class="icon not-hover absolute -top-3 -left-3 -rotate-12 w-8 scale-hover p-2 z-[100000000]"
			on:click={() => {
				if (!game_over) {
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
			<span class="inline-block align-top truncate w-1/2">@{player_name}</span>
			{#if its_me}
				<span class="align-top text-neutral-500"> (you)</span>
			{/if}
		</p>
		<p class="truncate w-1/2">Score: <span>{$ScoresStore[player_number]}</span></p>
	</div>
	<NextPieces player={player_number} />
	<p class="level-{level_side} select-none absolute block w-0 h-0 bottom-2 -rotate-90">
		{#each new Array($LevelStore).fill('>') as level, index}
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
