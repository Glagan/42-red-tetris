<!-- ========================= SCRIPT -->
<script lang="ts">
	import SoundStore from '../../stores/sound';
	export let open = false;
	import { browser } from '$app/env';
	import * as Sounds from '../../effects/sounds';

	let sound_loaded = false;

	if (browser) {
		SoundStore.load(() => {
			sound_loaded = true;
		});
	}

	$: sound_icon = $SoundStore.status ? '/icons/volume.png' : '/icons/mute.png';

	function handle_sound_switch(event: any) {
		event.target.blur();
		SoundStore.switch();
	}

	function handle_open_close(event: any) {
		event.target.blur();
		open = !open;
	}
</script>

<!-- ========================= HTML -->
<div class="absolute right-0 m-3 z-[20000000]">
	<button
		style="opacity: {+sound_loaded};"
		class="icon not-hover"
		on:click={(event) => {
			Sounds.select();
			handle_sound_switch(event);
		}}
		tabindex="-1"
	>
		<img src={sound_icon} alt="sound icon" />
	</button>
	<button class="icon not-hover hover:rotate-90" on:click={handle_open_close} tabindex="-1">
		<img src="/icons/parameters.png" alt="parameters icon" />
	</button>
</div>
