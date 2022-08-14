<!-- ========================= SCRIPT -->
<script lang="ts">
	import UsernameStore from '../client/stores/username';
	import { browser } from '$app/env';
	import CentralBox from '../client/components/containers/central-box.svelte';
	import WinnerStore from '$client/stores/winner';
	import OpponenReadytStore from '../client/stores/opponentReady';
	import * as Sounds from '../client/effects/sounds';
	import Username from '../client/socket/username.emit';
	import { join_url as JoinUrl } from '../client/socket/join.emit';

	let username = '';
	let hasInput = false;
	let loading = false;

	if (browser && $UsernameStore.length > 0) {
		username = $UsernameStore;
	}

	$: disabled = username.length == 0 || username.length > 25 || loading;

	function onUsernameInput() {
		hasInput = true;
		Sounds.text();
	}

	function handle() {
		if (disabled) {
			return;
		}

		loading = true;
		Username(username, () => {
			loading = false;
		});
	}

	OpponenReadytStore.set(false);
	WinnerStore.remove();

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
			class:with-error={(hasInput && username.length < 1) || username.length > 25}
			placeholder="Your username"
			bind:value={username}
			min="1"
			max="25"
			on:input={onUsernameInput}
		/>
		<button class="mt-5 transition-all" type="submit" {disabled}>Enter</button>
	</form>
</CentralBox>
