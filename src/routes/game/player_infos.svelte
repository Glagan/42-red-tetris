<!-- ========================= SCRIPT -->
<script lang="ts">
	import PlayerInfo from './player_info.svelte';
	import CurrentRoomStore from '../../client/stores/currentRoom';

	export let solo: boolean;
</script>

<!-- ========================= HTML -->
<div class="flex flex-row justify-around">
	<PlayerInfo horizontal_alignement={solo ? 0 : -1} player={$CurrentRoomStore?.players[0]} />
	{#if !solo}
		<PlayerInfo horizontal_alignement={1} player={$CurrentRoomStore?.players[1]} />
	{/if}
</div>
