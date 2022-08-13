<!-- ========================= SCRIPT -->
<script lang="ts">
	import Config from '../../client/config';

	export let sprites: string[] = ['/sprites/default/cross.png'];

	$: sprite_side = sprites[0];
	$: sprite_top = sprites.length >= 2 ? sprites[1] : sprite_side;
	$: sprite_bottom = sprites.length >= 3 ? sprites[2] : sprite_top;

	export let position_x: number;
	export let position_y: number;
	export let z_index = 0;
	export let layer = 0;
	export let background = false;
	export let horizontal_alignement: number | undefined = undefined;
	export let opacity = 1;
	export let no_front = false;
	export let info_mode = false;
	export let spectre = false;

	$: position_x_px =
		position_x * (info_mode ? Config.game_info.block_size : Config.game.block_size);
	$: position_y_px =
		position_y * (info_mode ? Config.game_info.block_size : Config.game.block_size);
	$: position_z_px = layer * (info_mode ? Config.game_info.block_size : Config.game.block_size);

	$: show_front = !no_front && !(background && Config.game.background._3Dto2D);

	$: show_back = opacity != 1;

	$: show_left =
		opacity != 1 ||
		(horizontal_alignement != undefined &&
			horizontal_alignement <= 0 &&
			!(background && position_x != 0));

	$: show_right =
		opacity != 1 ||
		(horizontal_alignement != undefined &&
			horizontal_alignement >= 0 &&
			!(background && position_x != 9));

	$: show_top = opacity != 1 || (position_y > 9 && !background);
	$: show_bottom = opacity != 1 || (position_y < 9 && !background);

	$: in_board = position_x >= 0 && position_x < 10 && position_y >= 0 && position_y < 20;
	$: show =
		in_board && (show_front || show_back || show_left || show_right || show_top || show_bottom);
</script>

<!-- ========================= HTML -->
{#if show}
	<div
		class:info={info_mode}
		class="cube"
		style="transform: translate3d({position_x_px}px, {position_y_px}px , {position_z_px}px); z-index: {z_index}; will-change: {background
			? 'transform'
			: 'transform'}; contain: {background ? 'layout' : 'none'};"
	>
		{#if show_front}
			<div class:spectre class="front" style="background-image: url('{sprite_side}');" />
		{/if}
		{#if show_back}
			<div class:spectre class="back" style="background-image: url('{sprite_side}');" />
		{/if}
		{#if show_top}
			<div class:spectre class="top" style="background-image: url('{sprite_top}');" />
		{/if}
		{#if show_bottom}
			<div class:spectre class="bottom" style="background-image: url('{sprite_bottom}');" />
		{/if}
		{#if show_left}
			<div class:spectre class="left" style="background-image: url('{sprite_side}');" />
		{/if}
		{#if show_right}
			<div class:spectre class="right" style="background-image: url('{sprite_side}');" />
		{/if}
	</div>
{/if}

<!-- ========================= CSS -->
<style lang="postcss">
	.cube {
		position: absolute;
		margin: auto;
		height: var(--cube-size);
		width: var(--cube-size);
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
	}

	.spectre {
		@apply opacity-60;
	}

	.info {
		height: var(--cube-info-size);
		width: var(--cube-info-size);
	}

	.cube > div {
		position: absolute;
		box-sizing: border-box;
		text-align: center;
		height: 100%;
		width: 100%;
		background-position: center;
		background-size: cover;
	}

	.cube > .front {
		-webkit-transform: translateZ(var(--cube-half-size));
		transform: translateZ(var(--cube-half-size));
		/* background-color: #00d7ff; */
	}

	.cube > .back {
		-webkit-transform: translateZ(var(--cube-half-size-negative)) rotateY(180deg);
		transform: translateZ(var(--cube-half-size-negative)) rotateY(180deg);
		/* background-color: #e86836; */
	}

	.cube > .right {
		-webkit-transform: rotateY(-270deg) translateX(var(--cube-half-size));
		transform: rotateY(-270deg) translateX(var(--cube-half-size));
		transform-origin: top right;
		/* background-color: #ffc900; */
	}

	.cube > .left {
		-webkit-transform: rotateY(270deg) translateX(var(--cube-half-size-negative));
		transform: rotateY(270deg) translateX(var(--cube-half-size-negative));
		transform-origin: center left;
		/* background-color: #00ff73; */
	}

	.cube > .top {
		-webkit-transform: rotateX(-270deg) translateY(var(--cube-half-size-negative));
		transform: rotateX(-270deg) translateY(var(--cube-half-size-negative));
		transform-origin: top center;
		/* background-color: #ff00f9; */
	}

	.cube > .bottom {
		-webkit-transform: rotateX(270deg) translateY(var(--cube-half-size));
		transform: rotateX(270deg) translateY(var(--cube-half-size));
		transform-origin: bottom center;
		/* background-color: #7552bc; */
	}
</style>
