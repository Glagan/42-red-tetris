<!-- ========================= SCRIPT -->
<script lang="ts">
	import CubeComponent from './cube.svelte';
	import type Cube from '$client/lib/Cube';
	import calculateZIndex from '$utils/cube-z-index';

	export let layer = 0;
	export let background = false;
	export let horizontalAlignement: -1 | 0 | 1 = 0; // -1:left | 0:center | 1:right
	export let piece: Cube[] | undefined = undefined;
	export let infoMode = false;
	export let spectre = false;
</script>

<!-- ========================= HTML -->
{#if piece != undefined}
	{#each piece as cube}
		<CubeComponent
			x={cube.x}
			y={cube.y}
			sprites={cube.sprites}
			zIndex={calculateZIndex(cube.x, cube.y, horizontalAlignement)}
			{layer}
			{background}
			{horizontalAlignement}
			{infoMode}
			{spectre}
		/>
	{/each}
{/if}
