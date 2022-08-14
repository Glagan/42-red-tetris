<!-- ========================= SCRIPT -->
<script lang="ts">
	import username from '$client/stores/username';
	import { browser } from '$app/env';
	import CentralBox from '$components/containers/central-box.svelte';
	import winner from '$client/stores/winner';
	import opponentReady from '$client/stores/opponentReady';
	import * as Sounds from '$client/effects/sounds';
	import Username from '$client/socket/username.emit';
	import { join_url as JoinUrl } from '$client/socket/join.emit';

	let usernameInput = '';
	let hasInput = false;
	let loading = false;

	if (browser && $username.length > 0) {
		usernameInput = $username;
	}

	$: disabled = usernameInput.length == 0 || usernameInput.length > 25 || loading;

	function onUsernameInput() {
		hasInput = true;
		Sounds.text();
	}

	function handle() {
		if (disabled) {
			return;
		}

		loading = true;
		Username(usernameInput, () => {
			loading = false;
		});
	}

	opponentReady.set(false);
	winner.remove();

	let location: string | undefined = undefined;

	if (browser) {
		location = window.location.hash;
		if (location.length > 0 && location[0] === '#') JoinUrl(location);
	}
</script>

<!-- ========================= HTML -->
<CentralBox title="Username" {loading}>
	{#if location}
		<h2>{location}</h2>
	{/if}
	<form on:submit|preventDefault={handle}>
		<input
			type="text"
			class="text-input"
			class:with-error={(hasInput && usernameInput.length < 1) || usernameInput.length > 25}
			placeholder="Your username"
			bind:value={usernameInput}
			min="1"
			max="25"
			on:input={onUsernameInput}
		/>
		<button class="mt-5 transition-all" type="submit" {disabled}>Enter</button>
	</form>
</CentralBox>
