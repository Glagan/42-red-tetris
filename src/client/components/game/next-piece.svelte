<!-- ========================= SCRIPT -->
<script lang="ts">
	import Piece from './piece.svelte';
	import type _Cube from '$client/lib/Cube';
	import Config from '$client/config';

	export let piece: _Cube[] | undefined = undefined;
	export let opacity = 1;

	const default_size = {
		x: 4,
		y: 2
	};

	function find_max_xy_cube(xy: 'x' | 'y', piece: _Cube[]): number {
		let max = 0;

		if (piece != undefined)
			for (let i = 0; i < piece.length; i++) if (piece[i][xy] > max) max = piece[i][xy];

		return max + 1;
	}

	function need_to_translate(xy: 'x' | 'y', piece: _Cube[]): number {
		const max = find_max_xy_cube(xy, piece);

		return (default_size[xy] - max) / 2;
	}

	$: translate_x =
		piece != undefined ? need_to_translate('x', piece) * Config.game_info.block_size : 0;
</script>

<!-- ========================= HTML -->
{#if piece != undefined}
	<div
		class="m-1"
		style="width: {default_size.x * Config.game_info.block_size}px;
        height: {(default_size.y * Config.game_info.block_size) /
			2}px; transform: translateX({translate_x}px); opacity: {opacity};"
	>
		<Piece {piece} info_mode />
	</div>
{/if}
