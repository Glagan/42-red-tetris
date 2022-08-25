<!-- ========================= SCRIPT -->
<script lang="ts">
	import CubeComponent from './cube.svelte';
	import Config from '$client/config';
	import type Cube from '$client/lib/Cube';
	import calculateZIndex from '$utils/cube-z-index';
	import Piece from './piece.svelte';

	export let cubes: Cube[];
	export let piece: Cube[] | undefined = undefined;
	export let spectre: Cube[] | undefined = undefined;
	export let horizontalAlignement: -1 | 0 | 1 = 0; // -1:left | 0:center | 1:right
	export let background = false;
	export let layer = 0;
	export let backgroundPicture: string | undefined = undefined;
	export let background3Dto2D: string | undefined = undefined;
	export let backgroundWithoutFront = false;
	export let backgroundBrightness = 100;

	$: cssPosition = layer != 0 ? 'absolute' : 'relative';
</script>

<!-- ========================= HTML -->
<div
	class="cube-wrap select-none"
	style="perspective-origin: calc({50 + 50 * horizontalAlignement}% + {horizontalAlignement *
		80}px) center; position: {cssPosition}; z-index: {layer + 100};"
>
	{#if backgroundPicture != undefined}
		<div
			class="board-background"
			style="background-image: url({backgroundPicture}); transform: translateZ(-{Config.game
				.blockSize / 2}px);"
			alt="board background"
		/>
	{:else if background3Dto2D != undefined}
		<img
			src={background3Dto2D}
			alt="board background"
			class="board-background"
			style="transform: translateZ(-{Config.game.blockSize /
				2}px); filter: brightness({backgroundBrightness}%);"
		/>
	{/if}
	<Piece {layer} {background} {horizontalAlignement} {piece} />
	<Piece {layer} {background} {horizontalAlignement} piece={spectre} spectre />
	{#each cubes as cube (cube.id)}
		<CubeComponent
			x={cube.x}
			y={cube.y}
			zIndex={calculateZIndex(cube.x, cube.y, horizontalAlignement)}
			sprites={cube.sprites}
			noFront={backgroundWithoutFront}
			{layer}
			{background}
			{horizontalAlignement}
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
