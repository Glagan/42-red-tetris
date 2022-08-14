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
		found: 'sounds/found.wav',
		join: 'sounds/join.wav',
		leave: 'sounds/leave.wav',
		select: 'sounds/select.wav'
	},
	game: {
		tetris: 'sounds/tetris.wav',
		touchFloor: 'sounds/touch_floor.wav',
		leftAndRight: 'sounds/left_right.wav',
		down: 'sounds/down.wav',
		dash: 'sounds/dash.wav',
		rotate: 'sounds/rotate.wav',
		gameover: 'sounds/gameover.wav',
		removeLine: 'sounds/remove_line.wav',
		addPenalty: 'sounds/add_penalty.wav'
	}
};

function play(url: string) {
	if (browser && get(sound).status) {
		const audio = new Audio(url);
		audio.volume = get(sound).volume;
		audio.play();
	}
}

// ---------------------- Navigation

export function cancel() {
	play(sounds.navigation.cancel);
}

export function ok() {
	play(sounds.navigation.ok);
}

export function text() {
	play(sounds.navigation.text);
}

export function select() {
	play(sounds.navigation.select);
}

export function error() {
	addPenalty();
}

// ---------------------- Game

export function tetris() {
	play(sounds.game.tetris);
}

export function touchFloor() {
	play(sounds.game.touchFloor);
}

export function leftAndRight() {
	play(sounds.game.leftAndRight);
}

export function down() {
	play(sounds.game.down);
}

export function dash() {
	play(sounds.game.dash);
}

export function rotate() {
	play(sounds.game.rotate);
}

export function gameOver() {
	play(sounds.game.gameover);
}

export function addPenalty() {
	play(sounds.game.addPenalty);
}

export function removeLine() {
	play(sounds.game.removeLine);
}

/* c8 ignore end */
