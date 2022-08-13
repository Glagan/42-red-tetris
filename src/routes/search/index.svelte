<!-- ========================= SCRIPT -->
<script lang="ts">
	import { onMount } from 'svelte';
	import CentralBox from '../../client/components/containers/central_box.svelte';
	import CurrentRoomStore from '../../client/stores/currentRoom';
	import MatchmakingStore from '../../client/stores/matchmaking';
	import RoomsStore from '../../client/stores/rooms';
	import SearchStore from '../../client/stores/search';
	import {
		leave_room as LeaveRoom,
		leave_matchmaking as LeaveMatchmaking
	} from '../../client/socket/leave.emit';
	import Search from '../../client/socket/search.emit';
	import {
		join_room as JoinRoom,
		join_matchmaking as JoinMatchmaking
	} from '../../client/socket/join.emit';
	import Create from '../../client/socket/create.emit';
	import { browser } from '$app/env';
	import * as Sounds from '../../client/effects/sounds';

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

	function handle_create() {
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
	$: console.log($RoomsStore);
</script>

<!-- ========================= HTML -->
<CentralBox title="Join" {loading} show_username>
	<input
		type="text"
		class="text-input"
		placeholder="Search a game"
		value={$SearchStore}
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
		}}>Quick Match</button
	>
</CentralBox>

<CentralBox title="Create" {loading}>
	<input
		type="text"
		class="text-input"
		placeholder="Name"
		bind:value={create}
		on:input={Sounds.text}
	/>
	<button
		class="mt-5"
		disabled={create.length < 1}
		on:click={() => {
			Sounds.ok();
			handle_create();
		}}>Create</button
	>
</CentralBox>
