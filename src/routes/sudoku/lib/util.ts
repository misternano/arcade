import { createMatrix, shuffle, type Coord, type Rng } from "$lib/gameUtils";

export const SIZE = 9;
export const BOX_SIZE = 3;
export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const DEFAULT_GIVEN_COUNT = 22;
export const DEFAULT_HOLES = SIZE * SIZE - DEFAULT_GIVEN_COUNT;

export type Digit = (typeof DIGITS)[number];
export type CellValue = Digit | null;

export type Cell = Readonly<{
	value: CellValue;
	notes: Digit[];
	fixed: boolean;
}>;

export type Board = Cell[][];
export type NumberGrid = number[][];

export const createEmptyBoard = (): Board => {
	return createMatrix(SIZE, SIZE, () => ({
		value: null,
		notes: [],
		fixed: false
	}));
};

const createEmptyGrid = (): NumberGrid => {
	return createMatrix(SIZE, SIZE, () => 0);
};

export const cellKey = (row: number, col: number): string => {
	return `${row}-${col}`;
};

export const isDigit = (value: number): value is Digit => {
	return Number.isInteger(value) && value >= 1 && value <= SIZE;
};

export const isSafePlacement = (grid: NumberGrid, row: number, col: number, value: Digit): boolean => {
	for (let i = 0; i < SIZE; i++) {
		if (grid[row][i] === value) return false;
		if (grid[i][col] === value) return false;
	}

	const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
	const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

	for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
		for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
			if (grid[r][c] === value) return false;
		}
	}

	return true;
};

const findEmptyCell = (grid: NumberGrid): Coord | null => {
	for (let row = 0; row < SIZE; row++) {
		for (let col = 0; col < SIZE; col++) {
			if (grid[row][col] === 0) return [row, col];
		}
	}
	return null;
};

const fillGrid = (grid: NumberGrid, rng: Rng): boolean => {
	const empty = findEmptyCell(grid);
	if (!empty) return true;

	const [row, col] = empty;
	for (const value of shuffle(DIGITS, rng)) {
		if (isSafePlacement(grid, row, col, value)) {
			grid[row][col] = value;
			if (fillGrid(grid, rng)) return true;
			grid[row][col] = 0;
		}
	}

	return false;
};

export const generateSolvedGrid = (rng: Rng = Math.random): NumberGrid => {
	const grid = createEmptyGrid();
	fillGrid(grid, rng);
	return grid;
};

const cloneGrid = (grid: NumberGrid): NumberGrid => {
	return grid.map((row) => [...row]);
};

export const makePuzzleFromSolution = (
	solution: NumberGrid,
	holes = DEFAULT_HOLES,
	rng: Rng = Math.random
): NumberGrid => {
	const grid = cloneGrid(solution);
	const clampedHoles = Math.max(0, Math.min(SIZE * SIZE, Math.floor(holes)));
	let removed = 0;

	while (removed < clampedHoles) {
		const row = Math.floor(rng() * SIZE);
		const col = Math.floor(rng() * SIZE);

		if (grid[row][col] !== 0) {
			grid[row][col] = 0;
			removed++;
		}
	}

	return grid;
};

export const boardFromGrid = (grid: NumberGrid): Board => {
	return createMatrix(SIZE, SIZE, (row, col) => {
		const value = isDigit(grid[row][col]) ? grid[row][col] : null;
		return {
			value,
			notes: [],
			fixed: value !== null
		};
	});
};

export const generatePuzzleBoard = (holes = DEFAULT_HOLES, rng: Rng = Math.random): Board => {
	const solved = generateSolvedGrid(rng);
	const puzzle = makePuzzleFromSolution(solved, holes, rng);
	return boardFromGrid(puzzle);
};

const addDuplicateConflicts = (groups: Map<Digit, Coord[]>, conflicts: Set<string>): void => {
	for (const coords of groups.values()) {
		if (coords.length <= 1) continue;
		for (const [row, col] of coords) conflicts.add(cellKey(row, col));
	}
};

export const computeConflicts = (board: Board): Set<string> => {
	const conflicts = new Set<string>();

	for (let row = 0; row < SIZE; row++) {
		const seen = new Map<Digit, Coord[]>();
		for (let col = 0; col < SIZE; col++) {
			const value = board[row][col].value;
			if (value === null) continue;
			seen.set(value, [...(seen.get(value) ?? []), [row, col]]);
		}
		addDuplicateConflicts(seen, conflicts);
	}

	for (let col = 0; col < SIZE; col++) {
		const seen = new Map<Digit, Coord[]>();
		for (let row = 0; row < SIZE; row++) {
			const value = board[row][col].value;
			if (value === null) continue;
			seen.set(value, [...(seen.get(value) ?? []), [row, col]]);
		}
		addDuplicateConflicts(seen, conflicts);
	}

	for (let boxRow = 0; boxRow < BOX_SIZE; boxRow++) {
		for (let boxCol = 0; boxCol < BOX_SIZE; boxCol++) {
			const seen = new Map<Digit, Coord[]>();
			const startRow = boxRow * BOX_SIZE;
			const startCol = boxCol * BOX_SIZE;
			for (let row = startRow; row < startRow + BOX_SIZE; row++) {
				for (let col = startCol; col < startCol + BOX_SIZE; col++) {
					const value = board[row][col].value;
					if (value === null) continue;
					seen.set(value, [...(seen.get(value) ?? []), [row, col]]);
				}
			}
			addDuplicateConflicts(seen, conflicts);
		}
	}

	return conflicts;
};

export const isBoardComplete = (board: Board): boolean => {
	return board.every((row) => row.every((cell) => cell.value !== null));
};
