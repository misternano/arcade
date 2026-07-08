import { isDebugEnabled, type DebugGameId } from "./storage";

export type StopWatchingDebug = () => void;

export const watchDebugFlag = (
	game: DebugGameId,
	onChange: (enabled: boolean) => void,
	intervalMs = 1000
): StopWatchingDebug => {
	const sync = () => onChange(isDebugEnabled(game));
	sync();

	const timer = setInterval(sync, intervalMs);
	return () => clearInterval(timer);
};
