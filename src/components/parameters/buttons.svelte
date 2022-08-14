<!-- ========================= SCRIPT -->
<script lang="ts">
	import sound from '$client/stores/sound';
	import { browser } from '$app/env';
	import * as Sounds from '$client/effects/sounds';

	export let open = false;
	let loaded = false;

	if (browser) {
		sound.load(() => {
			loaded = true;
		});
	}

	$: icon = $sound.status ? '/icons/volume.png' : '/icons/mute.png';

	function toggleSound(
		event: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) {
		event.currentTarget.blur();
		sound.switch();
	}

	function toggleParameters(
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		event.currentTarget.blur();
		open = !open;
	}
</script>

<!-- ========================= HTML -->
<div class="absolute right-0 m-3 z-[20000000]">
	<button
		style="opacity: {+loaded};"
		class="icon not-hover"
		on:click={(event) => {
			Sounds.select();
			toggleSound(event);
		}}
		tabindex="-1"
	>
		<img src={icon} alt="sound icon" />
	</button>
	<button class="icon not-hover hover:rotate-90" on:click={toggleParameters} tabindex="-1">
		<img src="/icons/parameters.png" alt="parameters icon" />
	</button>
</div>
