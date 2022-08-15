import { writable } from 'svelte/store';
import { browser } from '$app/env';

const initial = {
	status: <boolean>false, // true:on | false:off
	volume: <number>1 // min:0 | max:1
};

const localStorageSoundKey = 'sound';
const localStorageVolumeKey = 'volume';

function createScoresStore() {
	const { subscribe, update } = writable(initial);

	return {
		subscribe,
		load: (callback: (() => void) | undefined = undefined) => {
			if (browser) {
				update((sound) => {
					// Status
					switch (localStorage.getItem(localStorageSoundKey)) {
						case 'true':
							sound.status = true;
							break;
						case 'false':
							sound.status = false;
							break;
					}

					// Volume
					const soundVolume = localStorage.getItem(localStorageVolumeKey);
					if (soundVolume != null) sound.volume = parseFloat(soundVolume);

					if (callback != undefined) callback();

					return sound;
				});
			}
		},
		switch: () => {
			update((sound) => {
				sound.status = !sound.status;
				localStorage.setItem(localStorageSoundKey, sound.status.toString());
				return sound;
			});
		},
		on: () => {
			update((sound) => {
				sound.status = true;
				localStorage.setItem(localStorageSoundKey, sound.status.toString());
				return sound;
			});
		},
		off: () => {
			update((sound) => {
				sound.status = false;
				localStorage.setItem(localStorageSoundKey, sound.status.toString());
				return sound;
			});
		},
		updateVolume: (volume: number) => {
			update((sound) => {
				sound.volume = volume;
				localStorage.setItem(localStorageVolumeKey, sound.volume.toString());
				return sound;
			});
		}
	};
}

export default createScoresStore();
