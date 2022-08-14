<!-- ========================= SCRIPT -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import CentralBox from '../../client/components/containers/central_box.svelte';
	import CurrentRoomStore from '$client/stores/currentRoom';
	import IdStore from '$client/stores/id';
	import UsernameStore from '$client/stores/username';
	import OpponentReady from '$client/stores/opponentReady';
	import ThreePoints from '$client/components/loading/three_points.svelte';
	import GameStartStore from '$client/stores/gameStart';
	import WinnerStore from '$client/stores/winner';
	import { leave_room as Leave } from '../../client/socket/leave.emit';
	import Ready from '../../client/socket/ready.emit';
	import Kick from '../../client/socket/kick.emit';
	import OpponenReadytStore from '../../client/stores/opponentReady';
	import * as Sounds from '../../client/effects/sounds';
	import { getRandomInt } from '$utils/random';

	// prevent come back <-
	if ($CurrentRoomStore == null || $CurrentRoomStore == undefined) {
		goto('/search');
	}

	$: i_am_owner = $IdStore === $CurrentRoomStore?.players[0].id;

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
		'When you complete more than two lines, your opponent receives additional lines.',
		'You can play in single player to beat your highscore.',
		'The game speed increase by 15% every 6 completed lines.',
		'The last player alive is the winner.'
	];

	let currentTip = getRandomInt(0, tips.length);
	const tipInterval = setInterval(() => {
		let lastTip = currentTip;
		currentTip = getRandomInt(0, tips.length);
		if (currentTip == lastTip) {
			currentTip = (currentTip + 1) % tips.length;
		}
	}, 5000);

	function handle_leave() {
		if (!game_will_start) {
			loading = true;
			Leave(() => {
				loading = false;
			});
		}
	}

	function handle_ready() {
		if (!game_will_start) {
			loading = true;
			Ready((new_ready: boolean) => {
				ready = new_ready;
				loading = false;
			});
		}
	}

	OpponenReadytStore.set(false);
	WinnerStore.remove();

	onDestroy(() => {
		clearInterval(tipInterval);
	});
</script>

<!-- ========================= HTML -->
<CentralBox title="Room" {loading} show_room>
	<p class="mt-3">{start_message}</p>
	<p class="text-neutral-400 mt-7">{tips[currentTip]}</p>
	<div class="button-container flex justify-between mt-6">
		<div class:opacity-0={opponent_is_absent && game_will_start} class="relative transition-all">
			<p>
				{#if !opponent_is_absent}
					@{opponent_username}
				{/if}
				<ThreePoints bind:waiting_time hidden={!opponent_is_absent} grey />
			</p>
			<button
				class="cant-click"
				class:transparent={opponent_is_absent || game_will_start}
				class:off={!$OpponentReady}>Ready</button
			>
			{#if !game_will_start && !opponent_is_absent && i_am_owner}
				<p
					on:click={() => {
						Sounds.cancel();
						Kick();
					}}
					class="underline-hover text-neutral-500 hover:text-white absolute bottom-1 -left-4 p-1 cursor-pointer"
				>
					Kick
				</p>
			{/if}
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
				class:cant-click={game_will_start}
				class:transparent={game_will_start}
				class:off={game_will_start}
				on:click={() => {
					Sounds.cancel();
					handle_leave();
				}}>Leave</button
			>
		</div>
		<div>
			<p>
				@{$UsernameStore}&nbsp;<span class="text-neutral-500">(you)</span>
			</p>
			<button
				class:cant-click={game_will_start}
				class:transparent={game_will_start}
				class:off={!ready}
				on:click={() => {
					Sounds.select();
					handle_ready();
				}}>Ready</button
			>
		</div>
	</div>
</CentralBox>

<!-- ========================= CSS -->
<style lang="postcss">
	button {
		@apply mt-4;
	}

	.button-container > div {
		@apply basis-0 flex-grow-[1];
	}

	.button-container > div > p {
		@apply truncate;
	}
</style>
