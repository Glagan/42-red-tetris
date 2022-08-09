<!-- ========================= SCRIPT -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import CentralBox from '../../client/components/containers/central_box.svelte';
	import CurrentRoomStore from '$client/stores/currentRoom';
	import UsernameStore from '$client/stores/username';
	import OpponentReady from '$client/stores/opponentReady';
	import ThreePoints from '$client/components/loading/three_points.svelte';
	import GameStartStore from '$client/stores/gameStart';
	import Leave from '../../client/socket/leave.emit';
	import Ready from '../../client/socket/ready.emit';

	// prevent come back <-
	if ($CurrentRoomStore == null || $CurrentRoomStore == undefined) {
		goto('/search');
	}

	$: game_will_start = $GameStartStore != -1;

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

	let loading = false;

	$: opponent_is_absent = opponent_username == null;

	const tips: string[] = [
		'When you complete more than two lines, your opponent receives additional lines.'
	];

	function abort() {
		if (!game_will_start) {
			loading = true;
			Leave(() => {
				loading = false;
			});
		}
	}

	function toggleReady() {
		if (!game_will_start) {
			loading = true;
			Ready((new_ready: boolean) => {
				ready = new_ready;
				loading = false;
			});
		}
	}
</script>

<!-- ========================= HTML -->
<CentralBox title="Room" {loading} show_room>
	<p class="mt-3">{start_message}</p>
	<p class="text-neutral-400 mt-7">{tips[0]}</p>
	<div class="button-container flex justify-between mt-6">
		<div>
			<p>
				{#if !opponent_is_absent}
					@{opponent_username}
				{/if}
				<ThreePoints bind:waiting_time hidden={!opponent_is_absent} grey />
			</p>
			<button
				class="mt-2 cant-click"
				class:transparent={opponent_is_absent || game_will_start}
				class:off={!$OpponentReady}>Ready</button
			>
		</div>
		<div>
			{#if game_will_start}
				<p class="text-center">
					start in {$GameStartStore} seconds
				</p>
			{:else}
				<p class="text-neutral-800 text-center">
					{waiting_time} seconds
				</p>
			{/if}
			<button
				class="mt-2"
				class:cant-click={game_will_start}
				class:transparent={game_will_start}
				class:off={game_will_start}
				on:click={abort}>Abort</button
			>
		</div>
		<div>
			<p>
				@{$UsernameStore}&nbsp;<span class="text-neutral-500">(you)</span>
			</p>
			<button
				class="mt-2"
				class:cant-click={game_will_start}
				class:transparent={game_will_start}
				class:off={!ready}
				on:click={toggleReady}>Ready</button
			>
		</div>
	</div>
</CentralBox>

<!-- ========================= CSS -->
<style lang="postcss">
	.button-container > div {
		@apply overflow-hidden basis-0 flex-grow-[1];
	}

	.button-container > div > p {
		@apply truncate;
	}
</style>
