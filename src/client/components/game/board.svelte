<!-- ========================= SCRIPT -->
<script lang="ts">
	import Cube from './cube.svelte';
	import Config from '../../config';
	import type _Cube from '../../lib/Cube';
	import calculate_z_index from '$utils/cube_z_index';
	import Piece from './piece.svelte';

	export let cubes: _Cube[];
	export let piece: _Cube[] | undefined = undefined;
	export let spectre: _Cube[] | undefined = undefined;
	export let horizontal_alignement: -1 | 0 | 1 = 0; // -1:left | 0:center | 1:right
	export let background = false;
	export let layer = 0;
	export let background_picture: string | undefined = undefined;
	export let background_3Dto2D: string | undefined = undefined;
	export let background_without_front = false;

	$: css_position = layer != 0 ? 'absolute' : 'relative';
</script>

<!-- ========================= HTML -->
<div
	class="cube-wrap select-none"
	style="perspective-origin: calc({50 + 50 * horizontal_alignement}% + {horizontal_alignement *
		80}px) center; position: {css_position}; z-index: {layer + 100};"
>
	{#if background_picture != undefined}
		<div
			class="board-background"
			style="background-image: url({background_picture}); transform: translateZ(-{Config.game
				.block_size / 2}px);"
			alt=""
		/>
	{:else if background_3Dto2D != undefined}
		<img
			src={background_3Dto2D}
			alt="board background"
			class="board-background"
			style="transform: translateZ(-{Config.game.block_size / 2}px);"
		/>
	{/if}
	<Piece {layer} {background} {horizontal_alignement} {piece} />
	<Piece {layer} {background} {horizontal_alignement} piece={spectre} spectre />
	{#each cubes as cube (cube.id)}
		<Cube
			position_x={cube.x}
			position_y={cube.y}
			z_index={calculate_z_index(cube.x, cube.y, horizontal_alignement)}
			sprites={cube.sprites}
			no_front={background_without_front}
			{layer}
			{background}
			{horizontal_alignement}
		/>
	{/each}
</div>

<!-- ========================= CSS -->
<style lang="postcss">
	.cube-wrap {
		@apply inline-block;
		width: var(--grid-width);
		height: var(--grid-height);
		left: 0;

		perspective: inherit;
		perspective-origin: -200px center;
	}

	.board-background {
		@apply absolute w-full h-full z-[-5000];
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
</style>
