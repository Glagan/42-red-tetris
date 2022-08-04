<!-- ========================= SCRIPT -->
<script lang="ts">
	import Boards from './boards.svelte';
	import PlayerInfo from './player_info.svelte';
</script>

<!-- ========================= HTML -->
<div class="w-fit m-auto mt-5 mb-3">
    <div class="flex flex-row justify-around">
        <PlayerInfo />
        <PlayerInfo />
    </div>
    <Boards />
</div>