/// <reference types="@sveltejs/kit" />

declare namespace svelteHTML {
	interface HTMLAttributes<T> {
		"on:swipe"?: (
			event: CustomEvent<{
				direction: "top" | "right" | "bottom" | "left";
				target: EventTarget;
			}>
		) => void;
	}
}
