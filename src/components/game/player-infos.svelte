<!-- ========================= SCRIPT -->
<script lang="ts">
	import PlayerInfo from './player-info.svelte';
	import currentRoom from '$client/stores/currentRoom';

	export let solo: boolean;
</script>

<!-- ========================= HTML -->
<div class="flex flex-row justify-around">
	<PlayerInfo horizontalAlignement={solo ? 0 : -1} player={$currentRoom?.players[0]} />
	{#if !solo}
		<PlayerInfo horizontalAlignement={1} player={$currentRoom?.players[1]} />
	{/if}
</div>
