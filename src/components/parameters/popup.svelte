<!-- ========================= SCRIPT -->
<script lang="ts">
	import CentralBoxPopup from '$components/containers/central-box-popup.svelte';
	import theme from '$client/stores/theme';
	import sound from '$client/stores/sound';
	import dimensions from '$client/stores/dimensions';
	import shadow from '$client/stores/shadow';
	import themes from '$client/themes/themes';
	import * as Sounds from '$client/effects/sounds';

	$: soundStatus = $sound.status;

	function changeTheme(index: number) {
		theme.set(index);
	}

	function toggleSound(
		event: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) {
		event.currentTarget.blur();
		sound.switch();
	}

	function changeSoundVolume(
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		sound.updateVolume(parseFloat(event.currentTarget.value));
	}
</script>

<!-- ========================= HTML -->
<CentralBoxPopup title="Parameters" extraLarge>
	<div>
		<h3>Theme</h3>
		<button
			class:off={$dimensions != 3}
			class="mt-3 inline-block m-2"
			on:click={() => {
				Sounds.select();
				dimensions.switch();
			}}>3D</button
		>
		<button
			class:off={!$shadow}
			class="mt-3 inline-block m-2"
			on:click={() => {
				Sounds.select();
				shadow.switch();
			}}>Shadow</button
		>
		<ul class="mt-3">
			{#each themes as currentTheme, index}
				<li class="inline-block m-2">
					<button
						class:off={index != $theme}
						on:click={() => {
							Sounds.select();
							changeTheme(index);
						}}>{currentTheme.name}</button
					>
				</li>
			{/each}
		</ul>
	</div>
	<div>
		<h3 class="mt-5">Sound</h3>
		<button
			class:off={!soundStatus}
			class="mt-5"
			on:click={(event) => {
				toggleSound(event);
				Sounds.select();
			}}>{soundStatus ? 'on' : 'off'}</button
		>
		<input
			type="range"
			class="mt-5"
			step="0.01"
			value={$sound.volume}
			on:change={(event) => {
				changeSoundVolume(event);
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
