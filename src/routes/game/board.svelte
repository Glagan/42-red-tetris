<!-- ========================= SCRIPT -->
<script lang="ts">
	import Cube from './cube.svelte';
	import GeneratedPieceStore from '../../client/stores/generatedPieces';
	import Config from '../../client/config';
	import { browser } from '$app/env';
	import type _Cube from '../../client/lib/Cube';

	export let cubes: Array<_Cube>;
	export let piece: Array<_Cube> | undefined = undefined;
	export let horizontal_alignement = 0; // -1:left | 0:center | 1:right
	export let background = false;
	export let layer = 0;
	export let background_picture: string | undefined = undefined;
	export let background_3Dto2D: string | undefined = undefined;
	export let background_without_front = false;

	$: css_position = layer != 0 ? 'absolute' : 'relative';

	function calculate_z_index(x: number, y: number) {
		return (
			-Math.abs(y - 9) * 20 + // y
			x * horizontal_alignement // x
		);
	}

	let xx = 7;

	if (browser) {
		document.onkeypress = function (event) {
			const char = event?.keyCode;

			if (char != undefined) {
				if (char == 97) {
					xx--;
					console.log('droite', xx);
				} else if (char == 100) {
					xx++;
					console.log('gauche', xx);
				}
			}
		};
	}
</script>

<!-- ========================= HTML -->
<div
	class="cube-wrap"
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
	{#if piece != undefined}
		{#each piece as cube}
			<Cube
				position_x={cube.x}
				position_y={cube.y}
				z_index={100000}
				sprites={cube.sprites}
				{layer}
				{background}
				{horizontal_alignement}
			/>
		{/each}
	{/if}
	<!-- {#if !background}
		<Cube
			position_x={xx}
			position_y={8}
			z_index={100000}
			sprites={cubes[0].sprites}
			{layer}
			{background}
			{horizontal_alignement}
		/>
	{/if} -->

	{#each cubes as cube (cube.id)}
		<Cube
			position_x={cube.x}
			position_y={cube.y}
			z_index={calculate_z_index(cube.x, cube.y)}
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
