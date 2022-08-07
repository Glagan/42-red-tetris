<!-- ========================= SCRIPT -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import Socket from '../../client/home-socket';
	import CentralBox from '../../client/components/containers/central_box.svelte';
	import type { BasicError } from 'src/socket';
	import type { Room } from '../../client/lib/Room';
	import { v4 as uuidv4 } from 'uuid';
	import NotificationStore from '../../client/stores/notification';
	import CurrentRoomStore from '../../client/stores/currentRoom';
	import RoomsStore from '../../client/stores/rooms';

	let create = '';
	let search = '';
	let loading = false;

	$: disabled_create = create.length == 0;

	function handle_quick_match() {
		// goto('/matchmaking?');
	}

	function handle_search() {
		Socket.emit('room:search', search, (rooms: Room[], error: BasicError | null | undefined) => {
			if (error != null && error != undefined) {
				NotificationStore.push({ id: uuidv4(), message: error.message, error: true });
			} else {
				RoomsStore.set(rooms);
			}
		});
	}

	function handle_join(id: string) {
		loading = true;
		Socket.emit('room:join', id, (room: Room | null, error: BasicError | null | undefined) => {
			if (error != null && error != undefined) {
				NotificationStore.push({ id: uuidv4(), message: error.message, error: true });
			} else {
				if (room != null) {
					CurrentRoomStore.set(room);
					NotificationStore.push({ id: uuidv4(), message: 'room joined', error: false });
					goto('/matchmaking');
				} else {
					NotificationStore.push({
						id: uuidv4(),
						message: 'room not joined',
						error: true
					});
				}
			}
			loading = false;
		});
	}

	function handle_create() {
		loading = true;
		if (create.length > 0) {
			Socket.emit(
				'room:create',
				create,
				(room: Room | null, error: BasicError | null | undefined) => {
					if (error != null && error != undefined) {
						NotificationStore.push({ id: uuidv4(), message: error.message, error: true });
					} else {
						if (room != null) {
							CurrentRoomStore.set(room);
							NotificationStore.push({ id: uuidv4(), message: 'room created', error: false });
							goto('/room');
						} else {
							NotificationStore.push({
								id: uuidv4(),
								message: 'room not created',
								error: true
							});
						}
					}
					loading = false;
				}
			);
		}
	}

	function leave_current_room() {
		console.log('start leave_current_room');
		if ($CurrentRoomStore != null) {
			console.log('on rentre dans leave_current_room');
			loading = true;
			Socket.emit('room:leave', (success: boolean | null, error: BasicError | null | undefined) => {
				if (error != null && error != undefined) {
					NotificationStore.push({ id: uuidv4(), message: error.message, error: true });
				} else {
					if (success) {
						CurrentRoomStore.set(null);
						NotificationStore.push({ id: uuidv4(), message: 'room leaved', error: false });
						goto('/search');
					} else {
						NotificationStore.push({
							id: uuidv4(),
							message: 'room not leaved',
							error: true
						});
					}
				}
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
