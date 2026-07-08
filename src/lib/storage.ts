import { browser } from "$app/environment";

type ValueOf<T> = T[keyof T];

export const STORAGE_KEYS = {
	arcade: {
		debug: "arcade:debug",
		lastGame: "arcade:lastGame",
		menu: "arcade:menu"
	},
	games: {
		blackjack: {
			chips: "blackjack:chips",
			debug: "blackjack:debug"
		},
		minesweeper: {
			debug: "minesweeper:debug"
		},
		snake: {
			debug: "snake:debug",
			hiScore: "snake:hiScore"
		}
	}
} as const;

type GameStorageMap = typeof STORAGE_KEYS.games;

export type ArcadeStorageKey = ValueOf<typeof STORAGE_KEYS.arcade>;
export type GameStorageKey = { [K in keyof GameStorageMap]: ValueOf<GameStorageMap[K]> }[keyof GameStorageMap];
export type AchievementStorageKey = `achievement:${string}`;
export type AchievementProgressStorageKey = `achievement-progress:${string}`;
export type StorageKey = ArcadeStorageKey | GameStorageKey | AchievementStorageKey | AchievementProgressStorageKey;
export type DebugGameId = keyof typeof STORAGE_KEYS.games;

export const achievementStorageKey = (id: string): AchievementStorageKey => {
	return `achievement:${id}`;
};

export const achievementProgressStorageKey = (id: string): AchievementProgressStorageKey => {
	return `achievement-progress:${id}`;
};

export const readStorage = (key: StorageKey): string | null => {
	if (!browser) return null;
	try {
		return localStorage.getItem(key);
	} catch (_) {
		console.error(`[Issue reading ${key}]: `, _);
		return null;
	}
};

export const writeStorage = (key: StorageKey, value: string): boolean => {
	if (!browser) return false;
	try {
		localStorage.setItem(key, value);
		return true;
	} catch (_) {
		console.error(`[Issue writing ${key}]: `, _);
		return false;
	}
};

export const readJsonStorage = <T>(key: StorageKey, fallback: T): T => {
	const raw = readStorage(key);
	if (!raw) return fallback;
	try {
		return JSON.parse(raw) as T;
	} catch (_) {
		console.error(`[Issue parsing ${key}]: `, _);
		return fallback;
	}
};

export const writeJsonStorage = (key: StorageKey, value: unknown): boolean => {
	return writeStorage(key, JSON.stringify(value));
};

export const readNumberStorage = (
	key: StorageKey,
	fallback: number,
	options: { min?: number; max?: number } = {}
): number => {
	const raw = readStorage(key);
	if (raw == null) return fallback;
	const parsed = Number(raw);
	if (!Number.isFinite(parsed)) return fallback;
	if (options.min != null && parsed < options.min) return fallback;
	if (options.max != null && parsed > options.max) return fallback;
	return parsed;
};

export const writeNumberStorage = (key: StorageKey, value: number): boolean => {
	return writeStorage(key, String(value));
};

export const readBooleanStorage = (key: StorageKey): boolean => {
	return readStorage(key) === "1";
};

export const isDebugEnabled = (game: DebugGameId): boolean => {
	return readBooleanStorage(STORAGE_KEYS.arcade.debug) || readBooleanStorage(STORAGE_KEYS.games[game].debug);
};
