export type Rng = () => number;
export type Coord = readonly [row: number, col: number];

export const defaultRng: Rng = Math.random;

export const createMatrix = <T>(rows: number, cols: number, factory: (row: number, col: number) => T): T[][] => {
	return Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, col) => factory(row, col)));
};

export const isInBounds = (rows: number, cols: number, row: number, col: number): boolean => {
	return row >= 0 && col >= 0 && row < rows && col < cols;
};

export const shuffle = <T>(items: ReadonlyArray<T>, rng: Rng = defaultRng): T[] => {
	const next = items.slice();
	for (let i = next.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[next[i], next[j]] = [next[j], next[i]];
	}
	return next;
};

export const shuffleInPlace = <T>(items: T[], rng: Rng = defaultRng): void => {
	for (let i = items.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[items[i], items[j]] = [items[j], items[i]];
	}
};
