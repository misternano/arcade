import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { GAMES, type GameId } from "./game";
import { achievementProgressStorageKey, achievementStorageKey, readJsonStorage, readStorage, writeJsonStorage } from "./storage";

export type AchievementCategory =
	| "arcade"
	| "tictactoe"
	| "sudoku"
	| "snake"
	| "blackjack"
	| "minesweeper";

export type Achievement = Readonly<{
	id: string;
	title: string;
	description: string;
	category: AchievementCategory;
}>;

export type AchievementUnlock = Readonly<{
	id: string;
	unlockedAt: number;
}>;

export type AchievementView = Achievement & Readonly<{
	unlocked: boolean;
	unlockedAt: number | null;
}>;

export type AchievementToast = Readonly<{
	id: string;
	achievementId: string;
	title: string;
	description: string;
	category: AchievementCategory;
}>;

const openGameAchievements = GAMES.map((game) => ({
	id: `open-${game.slug}`,
	title: `Open ${game.name}`,
	description: `Visit ${game.name} for the first time.`,
	category: game.slug as AchievementCategory
}));

export const ACHIEVEMENTS: Achievement[] = [
	{
		id: "first-steps",
		title: "First Steps",
		description: "Open any game.",
		category: "arcade"
	},
	{
		id: "sampler-platter",
		title: "Sampler Platter",
		description: "Open every game.",
		category: "arcade"
	},
	{
		id: "arcade-regular",
		title: "Arcade Regular",
		description: "Open the arcade on 3 different days.",
		category: "arcade"
	},
	{
		id: "full-cabinet",
		title: "Full Cabinet",
		description: "Unlock one achievement in every game.",
		category: "arcade"
	},
	{
		id: "completionist",
		title: "Completionist",
		description: "Unlock every achievement.",
		category: "arcade"
	},
	...openGameAchievements,
	{
		id: "open-faq",
		title: "Read the Fine Print",
		description: "Open an FAQ item.",
		category: "arcade"
	},
	{
		id: "open-achievements",
		title: "Trophy Case",
		description: "Open the achievements page.",
		category: "arcade"
	},
	{
		id: "win-tictactoe",
		title: "Three in a Row",
		description: "Win a game of Tic-Tac-Toe.",
		category: "tictactoe"
	},
	{
		id: "draw-tictactoe",
		title: "No Easy Squares",
		description: "Play Tic-Tac-Toe to a draw.",
		category: "tictactoe"
	},
	{
		id: "tictactoe-center-stage",
		title: "Center Stage",
		description: "Start a Tic-Tac-Toe game by taking the center.",
		category: "tictactoe"
	},
	{
		id: "tictactoe-corner-pocket",
		title: "Corner Pocket",
		description: "Win Tic-Tac-Toe after opening from a corner.",
		category: "tictactoe"
	},
	{
		id: "tictactoe-block-party",
		title: "Block Party",
		description: "Block an opponent's immediate Tic-Tac-Toe win.",
		category: "tictactoe"
	},
	{
		id: "tictactoe-forklift",
		title: "Forklift Certified",
		description: "Create two winning threats at once in Tic-Tac-Toe.",
		category: "tictactoe"
	},
	{
		id: "tictactoe-comeback-line",
		title: "Comeback Line",
		description: "Win Tic-Tac-Toe after your opponent had two in a row.",
		category: "tictactoe"
	},
	{
		id: "tictactoe-cats-game-3",
		title: "Cat's Game",
		description: "Draw 3 Tic-Tac-Toe games.",
		category: "tictactoe"
	},
	{
		id: "win-sudoku",
		title: "Grid Whisperer",
		description: "Complete a Sudoku board without conflicts.",
		category: "sudoku"
	},
	{
		id: "sudoku-first-fill",
		title: "First Fill",
		description: "Enter your first correct Sudoku number.",
		category: "sudoku"
	},
	{
		id: "sudoku-clean-board",
		title: "Clean Board",
		description: "Solve a Sudoku without ever creating a conflict.",
		category: "sudoku"
	},
	{
		id: "sudoku-pencil-brain",
		title: "Pencil Brain",
		description: "Use Sudoku notes.",
		category: "sudoku"
	},
	{
		id: "sudoku-fast-logic",
		title: "Fast Logic",
		description: "Solve a Sudoku under 10 minutes.",
		category: "sudoku"
	},
	{
		id: "sudoku-last-square",
		title: "Last Square",
		description: "Complete a Sudoku by filling the final empty cell.",
		category: "sudoku"
	},
	{
		id: "sudoku-no-eraser",
		title: "No Eraser",
		description: "Solve a Sudoku without clearing a cell.",
		category: "sudoku"
	},
	{
		id: "win-minesweeper",
		title: "Clean Sweep",
		description: "Win a game of Minesweeper.",
		category: "minesweeper"
	},
	{
		id: "minesweeper-first-flag",
		title: "First Flag",
		description: "Place your first Minesweeper flag.",
		category: "minesweeper"
	},
	{
		id: "minesweeper-no-flags",
		title: "No Flags Needed",
		description: "Win Minesweeper without manually placing a flag.",
		category: "minesweeper"
	},
	{
		id: "minesweeper-speed-sweep",
		title: "Speed Sweep",
		description: "Win Beginner Minesweeper in under 60 seconds.",
		category: "minesweeper"
	},
	{
		id: "minesweeper-one-left",
		title: "One Left",
		description: "Win Minesweeper with one mine remaining unflagged before the final reveal.",
		category: "minesweeper"
	},
	{
		id: "minesweeper-brave-click",
		title: "Brave Click",
		description: "Reveal a safe Minesweeper tile adjacent to 3 or more mines.",
		category: "minesweeper"
	},
	{
		id: "minesweeper-perfect-sweep",
		title: "Perfect Sweep",
		description: "Win Minesweeper without resetting the board.",
		category: "minesweeper"
	},
	{
		id: "win-blackjack",
		title: "Beat the House",
		description: "Win a Blackjack round.",
		category: "blackjack"
	},
	{
		id: "blackjack-natural",
		title: "Natural 21",
		description: "Win a round with a blackjack.",
		category: "blackjack"
	},
	{
		id: "blackjack-push-it",
		title: "Push It",
		description: "Tie the dealer in Blackjack.",
		category: "blackjack"
	},
	{
		id: "blackjack-bust-proof",
		title: "Bust Proof",
		description: "Win 3 Blackjack rounds in a row without busting.",
		category: "blackjack"
	},
	{
		id: "blackjack-double-trouble",
		title: "Double Trouble",
		description: "Win a Blackjack round after doubling down.",
		category: "blackjack"
	},
	{
		id: "blackjack-hard-stop",
		title: "Hard Stop",
		description: "Stand on 17 and win in Blackjack.",
		category: "blackjack"
	},
	{
		id: "blackjack-comeback-kid",
		title: "Comeback Kid",
		description: "Drop below 500 chips, then recover above 1,500.",
		category: "blackjack"
	},
	{
		id: "blackjack-dealer-problem",
		title: "Dealer's Problem",
		description: "Make the dealer bust 5 times total.",
		category: "blackjack"
	},
	{
		id: "win-snake",
		title: "Snake Charmer",
		description: "Reach 30 points in Snake.",
		category: "snake"
	},
	{
		id: "snake-close-call",
		title: "Close Call",
		description: "Survive a turn within one tile of yourself in Snake.",
		category: "snake"
	},
	{
		id: "snake-perfect-start",
		title: "Perfect Start",
		description: "Eat 5 food in Snake without dying.",
		category: "snake"
	},
	{
		id: "snake-tiny-appetite",
		title: "Tiny Appetite",
		description: "Score exactly 1 in Snake and lose.",
		category: "snake"
	},
	{
		id: "snake-no-brakes",
		title: "No Brakes",
		description: "Reach 30 in Snake without pausing or restarting.",
		category: "snake"
	},
	{
		id: "snake-centipede-energy",
		title: "Centipede Energy",
		description: "Reach 150 points in Snake.",
		category: "snake"
	},
	{
		id: "snake-score-50",
		title: "Snack Run",
		description: "Reach 50 points in Snake.",
		category: "snake"
	},
	{
		id: "snake-score-75",
		title: "Long Game",
		description: "Reach 75 points in Snake.",
		category: "snake"
	},
	{
		id: "snake-score-100",
		title: "Snake Master",
		description: "Reach 100 points in Snake.",
		category: "snake"
	},
	{
		id: "blackjack-chips-1500",
		title: "House Money",
		description: "Reach 1,500 chips in Blackjack.",
		category: "blackjack"
	},
	{
		id: "blackjack-chips-5000",
		title: "Hot Table",
		description: "Reach 5,000 chips in Blackjack.",
		category: "blackjack"
	},
	{
		id: "blackjack-chips-10000",
		title: "Whale Mode",
		description: "Reach 10,000 chips in Blackjack.",
		category: "blackjack"
	}
];

const byId = new Map(ACHIEVEMENTS.map((achievement) => [achievement.id, achievement]));
const gameCategories: AchievementCategory[] = ["tictactoe", "sudoku", "snake", "blackjack", "minesweeper"];

export const readAchievement = (id: string): AchievementUnlock | null => {
	return readJsonStorage<AchievementUnlock | null>(achievementStorageKey(id), null);
};

const readProgress = <T>(id: string, fallback: T): T => {
	return readJsonStorage<T>(achievementProgressStorageKey(id), fallback);
};

const writeProgress = (id: string, value: unknown): boolean => {
	return writeJsonStorage(achievementProgressStorageKey(id), value);
};

const isUnlocked = (id: string): boolean => {
	return Boolean(readStorage(achievementStorageKey(id)));
};

const checkMetaAchievements = (): void => {
	if (!isUnlocked("sampler-platter") && GAMES.every((game) => isUnlocked(`open-${game.slug}`))) {
		unlockAchievement("sampler-platter");
	}

	if (
		!isUnlocked("full-cabinet") &&
		gameCategories.every((category) =>
			ACHIEVEMENTS.some((achievement) => achievement.category === category && isUnlocked(achievement.id))
		)
	) {
		unlockAchievement("full-cabinet");
	}

	if (
		!isUnlocked("completionist") &&
		ACHIEVEMENTS.every((achievement) => achievement.id === "completionist" || isUnlocked(achievement.id))
	) {
		unlockAchievement("completionist");
	}
};

export const achievementViews = (): AchievementView[] => {
	return ACHIEVEMENTS.map((achievement) => {
		const unlock = readAchievement(achievement.id);
		return {
			...achievement,
			unlocked: Boolean(unlock),
			unlockedAt: unlock?.unlockedAt ?? null
		};
	});
};

export const achievements = writable<AchievementView[]>(
	browser
		? achievementViews()
		: ACHIEVEMENTS.map((achievement) => ({ ...achievement, unlocked: false, unlockedAt: null }))
);

export const achievementToasts = writable<AchievementToast[]>([]);

export const refreshAchievements = (): void => {
	achievements.set(achievementViews());
};

export const dismissAchievementToast = (id: string): void => {
	achievementToasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
};

const queueAchievementToast = (achievement: Achievement): void => {
	if (!browser) return;
	const id = `${achievement.id}:${Date.now()}`;
	achievementToasts.update((toasts) => [
		...toasts.slice(-2),
		{
			id,
			achievementId: achievement.id,
			title: achievement.title,
			description: achievement.description,
			category: achievement.category
		}
	]);
	setTimeout(() => dismissAchievementToast(id), 4200);
};

export const unlockAchievement = (id: string): boolean => {
	const achievement = byId.get(id);
	if (!achievement) return false;
	if (readStorage(achievementStorageKey(id))) return false;

	const unlocked = writeJsonStorage(achievementStorageKey(id), { id, unlockedAt: Date.now() });
	if (unlocked) {
		refreshAchievements();
		queueAchievementToast(achievement);
		if (id !== "completionist") checkMetaAchievements();
	}
	return unlocked;
};

export const unlockGameOpened = (game: GameId): boolean => {
	unlockAchievement("first-steps");
	return unlockAchievement(`open-${game}`);
};

export const recordArcadeVisit = (date = new Date()): void => {
	if (!browser) return;
	const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
	const days = readProgress<string[]>("arcade-visit-days", []);
	if (!days.includes(day)) writeProgress("arcade-visit-days", [...days, day]);
	if (readProgress<string[]>("arcade-visit-days", []).length >= 3) unlockAchievement("arcade-regular");
};

export const unlockSnakeScoreAchievements = (score: number): void => {
	if (score >= 5) unlockAchievement("snake-perfect-start");
	if (score >= 30) unlockAchievement("win-snake");
	if (score >= 50) unlockAchievement("snake-score-50");
	if (score >= 75) unlockAchievement("snake-score-75");
	if (score >= 100) unlockAchievement("snake-score-100");
	if (score >= 150) unlockAchievement("snake-centipede-energy");
};

export const unlockBlackjackChipAchievements = (chips: number): void => {
	if (chips >= 1500) unlockAchievement("blackjack-chips-1500");
	if (chips >= 5000) unlockAchievement("blackjack-chips-5000");
	if (chips >= 10000) unlockAchievement("blackjack-chips-10000");
};

export const incrementAchievementProgress = (id: string, target: number, achievementId: string): number => {
	const next = readProgress<number>(id, 0) + 1;
	writeProgress(id, next);
	if (next >= target) unlockAchievement(achievementId);
	return next;
};

export const markAchievementProgress = (id: string, value = true): void => {
	writeProgress(id, value);
};

export const readAchievementProgress = <T>(id: string, fallback: T): T => {
	return readProgress<T>(id, fallback);
};

export const unlockedCount = (): number => {
	return ACHIEVEMENTS.reduce((count, achievement) => count + (readStorage(achievementStorageKey(achievement.id)) ? 1 : 0), 0);
};
