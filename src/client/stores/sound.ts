import { writable } from 'svelte/store';
import { browser } from '$app/env';

const initial = {
	status: <boolean>false, // true:on | false:off
	volume: <number>1 // min:0 | max:1
};

function createScoresStore() {
	const { subscribe, update } = writable(initial);

	return {
		subscribe,
		save: (callback: (() => void) | undefined = undefined) => {
			if (browser) {
				update((sound) => {
					// Status
					localStorage.setItem('sound_status', sound.status.toString());
					// Volume
					localStorage.setItem('sound_volume', sound.volume.toString());

					if (callback != undefined) callback();

					return sound;
				});
			}
		},
		load: (callback: (() => void) | undefined = undefined) => {
			if (browser) {
				update((sound) => {
					// Status
					switch (localStorage.getItem('sound_status')) {
						case 'true':
							sound.status = true;
							break;
						case 'false':
							sound.status = false;
							break;
					}

					// Volume
					const sound_volume = localStorage.getItem('sound_volume');
					if (sound_volume != null) sound.volume = parseFloat(sound_volume);

					if (callback != undefined) callback();

					return sound;
				});
			}
		},
		switch: () => {
			update((sound) => {
				sound.status = !sound.status;
				localStorage.setItem('sound_status', sound.status.toString());
				return sound;
			});
		},
		on: () => {
			update((sound) => {
				sound.status = true;
				localStorage.setItem('sound_status', sound.status.toString());
				return sound;
			});
		},
		off: () => {
			update((sound) => {
				sound.status = false;
				localStorage.setItem('sound_status', sound.status.toString());
				return sound;
			});
		},
		updateVolume: (volume: number) => {
			update((sound) => {
				sound.volume = volume;
				localStorage.setItem('sound_volume', sound.volume.toString());
				return sound;
			});
		}
	};
}

export default createScoresStore();
