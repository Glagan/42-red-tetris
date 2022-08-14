<!-- ========================= SCRIPT -->
<script lang="ts">
	import Piece from './piece.svelte';
	import type Cube from '$client/lib/Cube';
	import Config from '$client/config';

	export let piece: Cube[] | undefined = undefined;
	export let opacity = 1;

	const defaultSize = {
		x: 4,
		y: 2
	};

	function findMaxXYCube(xy: 'x' | 'y', piece: Cube[]): number {
		let max = 0;

		if (piece != undefined)
			for (let i = 0; i < piece.length; i++) if (piece[i][xy] > max) max = piece[i][xy];

		return max + 1;
	}

	function needTranslate(xy: 'x' | 'y', piece: Cube[]): number {
		const max = findMaxXYCube(xy, piece);

		return (defaultSize[xy] - max) / 2;
	}

	$: translateX = piece != undefined ? needTranslate('x', piece) * Config.gameInfo.blockSize : 0;
</script>

<!-- ========================= HTML -->
{#if piece != undefined}
	<div
		class="m-1"
		style="width: {defaultSize.x * Config.gameInfo.blockSize}px;
        height: {(defaultSize.y * Config.gameInfo.blockSize) /
			2}px; transform: translateX({translateX}px); opacity: {opacity};"
	>
		<Piece {piece} infoMode />
	</div>
{/if}
