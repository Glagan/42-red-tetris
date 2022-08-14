<!-- ========================= SCRIPT -->
<script lang="ts">
	import CentralBoxPopup from '$client/components/containers/central-box-popup.svelte';
	import ThemeStore from '$client/stores/theme';
	import SoundStore from '$client/stores/sound';
	import DimensionsStore from '$client/stores/dimensions';
	import ShadowStore from '$client/stores/shadow';
	import Themes from '$client/themes/themes';
	import * as Sounds from '$client/effects/sounds';

	$: sound_status = $SoundStore.status;

	function handle_theme(index: number) {
		ThemeStore.set(index);
	}

	function handle_sound_switch(event: any) {
		event.target.blur();
		SoundStore.switch();
	}

	function handle_sound_volume(event: any) {
		SoundStore.updateVolume(event.target.value);
	}
</script>

<!-- ========================= HTML -->
<CentralBoxPopup title="Parameters" extra_large>
	<div>
		<h3>Theme</h3>
		<button
			class:off={$DimensionsStore != 3}
			class="mt-3 inline-block m-2"
			on:click={() => {
				Sounds.select();
				DimensionsStore.switch();
			}}>3D</button
		>
		<button
			class:off={!$ShadowStore}
			class="mt-3 inline-block m-2"
			on:click={() => {
				Sounds.select();
				ShadowStore.switch();
			}}>Shadow</button
		>
		<ul class="mt-3">
			{#each Themes as theme, index}
				<li class="inline-block m-2">
					<button
						class:off={index != $ThemeStore}
						on:click={() => {
							Sounds.select();
							handle_theme(index);
						}}>{theme.name}</button
					>
				</li>
			{/each}
		</ul>
	</div>
	<div>
		<h3 class="mt-5">Sound</h3>
		<button
			class:off={!sound_status}
			class="mt-5"
			on:click={(event) => {
				handle_sound_switch(event);
				Sounds.select();
			}}>{sound_status ? 'on' : 'off'}</button
		>
		<input
			type="range"
			class="mt-5"
			step="0.01"
			value={$SoundStore.volume}
			on:change={(event) => {
				handle_sound_volume(event);
				Sounds.select();
			}}
			min="0"
			max="1"
		/>
	</div>
</CentralBoxPopup>

<!-- ========================= CSS -->
<style lang="postcss">
</style>
