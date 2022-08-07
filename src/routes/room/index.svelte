<!-- ========================= SCRIPT -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import CentralBox from '../../client/components/containers/central_box.svelte';
	import type { BasicError } from 'src/socket';
	import CurrentRoomStore from '$client/stores/currentRoom';
	import UsernameStore from '$client/stores/username';
	import { v4 as uuidv4 } from 'uuid';
	import ThreePoints from '$client/components/loading/three_points.svelte';
	import NotificationStore from '../../client/stores/notification';
	import Socket from '../../client/home-socket';
	import type Room from '$client/lib/Room';
	import type Player from '$client/lib/Player';

	// prevent come back <-
	if ($CurrentRoomStore == null || $CurrentRoomStore == undefined) {
		goto('/search');
	}

	$: start_message =
		$CurrentRoomStore != null && $CurrentRoomStore.players.length > 1
			? 'The game starts when both players are ready'
			: 'Waiting for another player';

	$: opponent_username = ((): string | null => {
		if ($CurrentRoomStore != null && $CurrentRoomStore.players.length > 1) {
			return $CurrentRoomStore.players[$CurrentRoomStore.players[0].name == $UsernameStore ? 1 : 0]
				.name;
		}
		return null;
	})();

	let waiting_time = 0;
	let ready = false;
	let opponent_ready = opponent_username != null;
	let loading = false;

	const tips: Array<string> = [
		'When you complete more than two lines, your opponent receives additional lines.'
	];

	Socket.on('room:playerJoined', (player: Player, room: Room) => {
		if (room.id == $CurrentRoomStore?.id) {
			CurrentRoomStore.add_player(player);
		}
	});

	function handle_abort() {
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
</script>

<!-- ========================= HTML -->
<CentralBox title="Room" {loading} show_room show_username>
	<h1>{$CurrentRoomStore?.players.length}</h1>
	<p class="mt-3">{start_message}</p>
	<p class="text-neutral-400 mt-7">{tips[0]}</p>
	<div class="flex justify-between mt-6">
		<div>
			<p>
				{#if opponent_username != null}
					opponent_username
				{:else}
					<ThreePoints bind:waiting_time />
				{/if}
			</p>
			<button class="mt-2 cant-click" class:off={!opponent_ready}>Ready</button>
		</div>
		<div>
			<p class="text-neutral-800 text-center" disabled={ready && opponent_ready}>
				{waiting_time} seconds
			</p>
			<button class="mt-2" on:click={handle_abort}>Abort</button>
		</div>
		<div>
			<p>
				<span class="underline underline-offset-1">toto</span>&nbsp;<span class="text-neutral-500"
					>(you)</span
				>
			</p>
			<button class="mt-2" class:off={!ready}>Ready</button>
		</div>
	</div>
</CentralBox>
