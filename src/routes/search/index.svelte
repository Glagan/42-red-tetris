<!-- ========================= SCRIPT -->
<script lang="ts">
	import { onMount } from 'svelte';
	import CentralBox from '$client/components/containers/central-box.svelte';
	import CurrentRoomStore from '$client/stores/currentRoom';
	import MatchmakingStore from '$client/stores/matchmaking';
	import RoomsStore from '$client/stores/rooms';
	import SearchStore from '$client/stores/search';
	import {
		leave_room as LeaveRoom,
		leave_matchmaking as LeaveMatchmaking
	} from '$client/socket/leave.emit';
	import Search from '$client/socket/search.emit';
	import {
		join_room as JoinRoom,
		join_matchmaking as JoinMatchmaking
	} from '$client/socket/join.emit';
	import Create from '$client/socket/create.emit';
	import { browser } from '$app/env';
	import * as Sounds from '$client/effects/sounds';

	let hasInput = false;
	let create = '';
	let loading = false;

	let searchTimeout: ReturnType<typeof setTimeout>;

	function debounceSearch() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			Search($SearchStore);
		}, 200);
	}

	function handle_join_room(id: string) {
		loading = true;
		JoinRoom(id, false, false, () => {
			loading = false;
		});
	}

	function onCreateInput() {
		hasInput = true;
		Sounds.text();
	}

	function handleCreate() {
		if (create.length == 0 || create.length > 25) {
			return;
		}

		Sounds.ok();
		loading = true;
		if (create.length > 0) {
			Create(create, () => {
				loading = false;
			});
		}
	}

	function handle_join_matchmaking() {
		loading = true;
		JoinMatchmaking(() => {
			loading = false;
		});
	}

	function handle_search(event: any) {
		SearchStore.set(event.target.value);
		debounceSearch();
	}

	function leave_current_room() {
		if ($CurrentRoomStore != null) {
			loading = true;
			LeaveRoom(() => {
				loading = false;
			});
		}
	}

	function leave_current_matchmaking() {
		if ($MatchmakingStore) {
			loading = true;
			LeaveMatchmaking(() => {
				loading = false;
			});
		}
	}

	leave_current_room();
	leave_current_matchmaking();

	if (browser) {
		onMount(() => {
			Search($SearchStore);
		});
	}
</script>

<!-- ========================= HTML -->
<CentralBox title="Join" {loading} show_username>
	<input
		type="text"
		class="text-input"
		class:with-error={$SearchStore.length > 50}
		placeholder="Search a game"
		value={$SearchStore}
		min="1"
		max="50"
		on:input={(event) => {
			Sounds.text();
			handle_search(event);
		}}
	/>
	<div class="games mt-5 w-[80%] m-auto h-[120px] overflow-y-scroll overflow-x-hidden">
		{#if $RoomsStore.length == 0}
			<p class="text-neutral-500 pt-10">No rooms available</p>
		{:else}
			{#each $RoomsStore as room (room.id)}
				{#if room != undefined && room.players.length < 2}
					<p
						class="cant-select scale-hover"
						on:click={() => {
							Sounds.ok();
							handle_join_room(room.id);
						}}
					>
						{room?.name}&nbsp;<span class="text-neutral-500">@{room?.players[0]?.name}</span>
					</p>
				{/if}
			{/each}
		{/if}
	</div>
	<button
		class="mt-5"
		on:click={() => {
			Sounds.ok();
			handle_join_matchmaking();
		}}
	>
		Quick Match
	</button>
</CentralBox>

<CentralBox title="Create" {loading}>
	<form on:submit|preventDefault={handleCreate}>
		<input
			type="text"
			class="text-input"
			class:with-error={(hasInput && create.length < 1) || create.length > 25}
			placeholder="Name"
			min="1"
			max="25"
			bind:value={create}
			on:input={onCreateInput}
		/>
		<button class="mt-5" disabled={create.length < 1 || create.length > 25}> Create </button>
	</form>
</CentralBox>
