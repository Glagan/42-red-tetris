<!-- ========================= SCRIPT -->
<script lang="ts">
	import Cube from './cube.svelte';
	import type _Cube from '../../client/lib/Cube';
	import calculate_z_index from '../../utils/cube_z_index';

	export let layer = 0;
	export let background = false;
	export let horizontal_alignement: -1 | 0 | 1 = 0; // -1:left | 0:center | 1:right
	export let piece: Array<_Cube> | undefined = undefined;
	export let info_mode = false;
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
		/>
	{/each}
{/if}
