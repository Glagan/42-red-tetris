<!-- ========================= SCRIPT -->
<script lang="ts">
	import { onMount } from 'svelte';
	import CentralBox from '$components/containers/central-box.svelte';
	import currentRoom from '$client/stores/currentRoom';
	import matchmaking from '$client/stores/matchmaking';
	import rooms from '$client/stores/rooms';
	import search from '$client/stores/search';
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
			Search($search);
		}, 200);
	}

	function joinRoom(id: string) {
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

	function joinMatchmaking() {
		loading = true;
		JoinMatchmaking(() => {
			loading = false;
		});
	}

	function executeSearch(query: string) {
		search.set(query);
		debounceSearch();
	}

	function leaveCurrentRoom() {
		if ($currentRoom != null) {
			loading = true;
			LeaveRoom(() => {
				loading = false;
			});
		}
	}

	function leaveMatchmaking() {
		if ($matchmaking) {
			loading = true;
			LeaveMatchmaking(() => {
				loading = false;
			});
		}
	}

	leaveCurrentRoom();
	leaveMatchmaking();

	if (browser) {
		onMount(() => {
			Search($search);
		});
	}
</script>

<!-- ========================= HTML -->
<CentralBox title="Join" {loading} showUsername>
	<input
		type="text"
		class="text-input"
		class:with-error={$search.length > 50}
		placeholder="Search a game"
		value={$search}
		min="1"
		max="50"
		on:input={(event) => {
			Sounds.text();
			executeSearch(event.currentTarget.value);
		}}
		maxlength="20"
	/>
	<div class="games mt-5 w-[80%] m-auto h-[120px] overflow-y-scroll overflow-x-hidden">
		{#if $rooms.length == 0}
			<p class="text-neutral-500 pt-10">No rooms available</p>
		{:else}
			{#each $rooms as room (room.id)}
				{#if room != undefined && room.players.length < 2}
					<p
						class="cant-select scale-hover"
						on:click={() => {
							Sounds.ok();
							joinRoom(room.id);
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
			joinMatchmaking();
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
			maxlength="20"
		/>
		<button class="mt-5" disabled={create.length < 1 || create.length > 25}> Create </button>
	</form>
</CentralBox>
