<!-- ========================= SCRIPT -->
<script lang="ts">
	import Cube from './cube.svelte';
	import type _Cube from '$client/lib/Cube';
	import calculate_z_index from '$utils/cube-z-index';

	export let layer = 0;
	export let background = false;
	export let horizontal_alignement: -1 | 0 | 1 = 0; // -1:left | 0:center | 1:right
	export let piece: _Cube[] | undefined = undefined;
	export let info_mode = false;
	export let spectre = false;
</script>

<!-- ========================= HTML -->
{#if piece != undefined}
	{#each piece as cube}
		<Cube
			position_x={cube.x}
			position_y={cube.y}
			sprites={cube.sprites}
			z_index={calculate_z_index(cube.x, cube.y, horizontal_alignement)}
			{layer}
			{background}
			{horizontal_alignement}
			{info_mode}
			{spectre}
		/>
	{/each}
{/if}
