<!-- ========================= SCRIPT -->
<script lang="ts">
	import CentralBox from '../../client/components/containers/central_box.svelte';
	import CurrentRoomStore from '../../client/stores/currentRoom';
	import RoomsStore from '../../client/stores/rooms';
	import Leave from '../../client/socket/leave.emit';
	import Search from '../../client/socket/search.emit';
	import Join from '../../client/socket/join.emit';
	import Create from '../../client/socket/create.emit';

	let create = '';
	let search = '';
	let loading = false;

	$: disabled_create = create.length == 0;

	function handle_quick_match() {
		// goto('/matchmaking?');
	}

	function handle_search() {
		Search(search);
	}

	function handle_join(id: string) {
		loading = true;
		Join(id, () => {
			loading = false;
		});
	}

	function handle_create() {
		loading = true;
		if (create.length > 0) {
			Create(create, () => {
				loading = false;
			});
		}
	}

	function leave_current_room() {
		if ($CurrentRoomStore != null) {
			loading = true;
			Leave(() => {
				loading = false;
			});
		}
	}

	leave_current_room();
</script>

<!-- ========================= HTML -->
<CentralBox title="Join" {loading} show_username>
	<input
		type="text"
		class="text-input"
		placeholder="Search a game"
		bind:value={search}
		on:input={handle_search}
	/>
	<div class="games mt-5 w-[80%] m-auto h-[120px] overflow-y-scroll overflow-x-hidden">
		{#if $RoomsStore.length == 0}
			<p class="text-neutral-500 pt-10">No rooms available</p>
		{:else}
			{#each $RoomsStore as room}
				<p class="cant-select-text scale-hover" on:click={() => handle_join(room.id)}>
					{room.name}&nbsp;<span class="text-neutral-500">@{room.players[0].name}</span>
				</p>
			{/each}
		{/if}
	</div>
	<button class="mt-5" on:click={handle_quick_match}>Quick Match</button>
</CentralBox>

<CentralBox title="Create" {loading}>
	<input type="text" class="text-input" placeholder="Name" bind:value={create} />
	<button class="mt-5" disabled={disabled_create} on:click={handle_create}>Create</button>
</CentralBox>
