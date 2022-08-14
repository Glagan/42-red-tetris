// https://sfxr.me/
/* c8 ignore start */

import { browser } from '$app/env';
import { get } from 'svelte/store';
import sound from '$client/stores/sound';

const sounds = {
	navigation: {
		cancel: 'sounds/cancel.wav',
		ok: 'sounds/ok.wav',
		text: 'sounds/text.wav',
		finded: 'sounds/finded.wav',
		join: 'sounds/join.wav',
		leave: 'sounds/leave.wav',
		select: 'sounds/select.wav'
	},
	game: {
		tetris: 'sounds/tetris.wav',
		touch_floor: 'sounds/touch_floor.wav',
		left_right: 'sounds/left_right.wav',
		down: 'sounds/down.wav',
		dash: 'sounds/dash.wav',
		rotate: 'sounds/rotate.wav',
		gameover: 'sounds/gameover.wav',
		remove_line: 'sounds/remove_line.wav',
		add_penalty: 'sounds/add_penalty.wav'
	}
};

function play_sound(url: string) {
	if (browser && get(sound).status) {
		const audio = new Audio(url);
		audio.volume = get(sound).volume;
		audio.play();
	}
}

// ---------------------- Navigation

export function cancel() {
	play_sound(sounds.navigation.cancel);
}

export function ok() {
	play_sound(sounds.navigation.ok);
}

export function text() {
	play_sound(sounds.navigation.text);
}

export function select() {
	play_sound(sounds.navigation.select);
}

export function error() {
	add_penalty();
}

// ---------------------- Game

export function tetris() {
	play_sound(sounds.game.tetris);
}

export function touch_floor() {
	play_sound(sounds.game.touch_floor);
}

export function left_right() {
	play_sound(sounds.game.left_right);
}

export function down() {
	play_sound(sounds.game.down);
}

export function dash() {
	play_sound(sounds.game.dash);
}

export function rotate() {
	play_sound(sounds.game.rotate);
}

export function gameover() {
	play_sound(sounds.game.gameover);
}

export function add_penalty() {
	play_sound(sounds.game.add_penalty);
}

export function remove_line() {
	play_sound(sounds.game.remove_line);
}

/* c8 ignore end */
