<!-- ========================= SCRIPT -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import CentralBox from '$components/containers/central-box.svelte';
	import currentRoom from '$client/stores/currentRoom';
	import id from '$client/stores/id';
	import username from '$client/stores/username';
	import opponentReady from '$client/stores/opponentReady';
	import ThreePoints from '$components/loading/three-points.svelte';
	import gameStart from '$client/stores/gameStart';
	import winner from '$client/stores/winner';
	import { leave_room as Leave } from '$client/socket/leave.emit';
	import Ready from '$client/socket/ready.emit';
	import Kick from '$client/socket/kick.emit';
	import * as Sounds from '$client/effects/sounds';
	import { getRandomInt } from '$utils/random';

	// prevent come back <-
	if ($currentRoom == null || $currentRoom == undefined) {
		goto('/search');
	}

	$: owner = $id === $currentRoom?.players[0].id;

	$: gameWillStart = $gameStart != -1;

	$: startMessage =
		$currentRoom != null && $currentRoom.players.length > 1
			? 'The game starts when both players are ready'
			: 'Waiting for another player';

	$: opponentUsername = ((): string | null => {
		if ($currentRoom != null && $currentRoom.players.length > 1) {
			return $currentRoom.players[$currentRoom.players[0].name == $username ? 1 : 0].name;
		}
		return null;
	})();

	let waitingTime = 0;
	let ready = false;

	let loading = false;

	$: singlePlayer = opponentUsername == null;

	function readableTime(duration: number) {
		if (duration >= 60) {
			if (duration >= 3600) {
				const hours = Math.floor(duration / 3600);
				return `${hours} hour${hours > 1 ? 's' : ''}`;
			}
			const minutes = Math.floor(duration / 60);
			return `${minutes} minute${minutes > 1 ? 's' : ''}`;
		}
		return `${duration} second${duration > 1 ? 's' : ''}`;
	}

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

	function leaveRoom() {
		if (!gameWillStart) {
			loading = true;
			Leave(() => {
				loading = false;
			});
		}
	}

	function readyUp() {
		if (!gameWillStart) {
			loading = true;
			Ready((value: boolean) => {
				ready = value;
				loading = false;
			});
		}
	}

	opponentReady.set(false);
	winner.remove();

	onDestroy(() => {
		clearInterval(tipInterval);
	});
</script>

<!-- ========================= HTML -->
<CentralBox title="Room" {loading} showRoom>
	<p class="mt-3">{startMessage}</p>
	<p class="text-neutral-400 mt-7">{tips[currentTip]}</p>
	<div class="button-container flex justify-between mt-6">
		<div class:opacity-0={singlePlayer && gameWillStart} class="relative transition-all">
			<p>
				{#if !singlePlayer}
					<span class="inline-block max-w-[100%] align-top truncate">{opponentUsername}</span>
				{/if}
				<ThreePoints bind:waitingTime hidden={!singlePlayer} grey />
			</p>
			<button
				class="cant-click"
				class:transparent={singlePlayer || gameWillStart}
				class:off={!$opponentReady}>Ready</button
			>
			{#if !gameWillStart && !singlePlayer && owner}
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
			{#if gameWillStart}
				<p class="text-center">
					start in {$gameStart} seconds
				</p>
			{:else}
				<p class="text-neutral-800 text-center">
					{readableTime(waitingTime)}
				</p>
			{/if}
			<button
				class:cant-click={gameWillStart}
				class:transparent={gameWillStart}
				class:off={gameWillStart}
				on:click={() => {
					Sounds.cancel();
					leaveRoom();
				}}>Leave</button
			>
		</div>
		<div>
			<p>
				<span class="inline-block max-w-[65%] align-top truncate">{$username}</span>&nbsp;<span
					class="text-neutral-500 align-top">(you)</span
				>
			</p>
			<button
				class:cant-click={gameWillStart}
				class:transparent={gameWillStart}
				class:off={!ready}
				on:click={() => {
					Sounds.select();
					readyUp();
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
		width: 30%;
	}

	.button-container > div > p {
		@apply truncate;
	}
</style>
