import { writable } from "svelte/store";
import { readJsonStorage, STORAGE_KEYS, writeJsonStorage } from "./storage";

export type LastGame = {
	slug: string;
	name: string;
	path: string;
	updatedAt: number;
}

const read = (): LastGame | null => {
	return readJsonStorage<LastGame | null>(STORAGE_KEYS.arcade.lastGame, null)
}

export const lastGame = writable<LastGame | null>(read())

export const setLastGame = (v: LastGame) => {
	lastGame.set(v)
	writeJsonStorage(STORAGE_KEYS.arcade.lastGame, v)
}
