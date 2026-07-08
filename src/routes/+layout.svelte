<script lang="ts">
	import "../app.css";
	import { Zap, X, Menu, ChevronLeft, ChevronRight, ArrowBigLeft, CircleQuestionMark, Trophy } from "lucide-svelte";
	import { NavBarGames } from "./components";
	import { page } from "$app/stores";
	import { normalizePathname, syncLastGameFromPath } from "$lib/game";
	import { afterNavigate } from "$app/navigation";
	import { onMount } from "svelte";
	import { readJsonStorage, STORAGE_KEYS, writeJsonStorage } from "$lib/storage";
	import { achievementToasts, dismissAchievementToast, recordArcadeVisit, unlockGameOpened } from "$lib/achievements";
	import type { AchievementCategory } from "$lib/achievements";

	let open = false;
	const close = () => (open = false);
	const toggle = () => (open = !open);

	let collapsed = false;

	const setCollapsed = (value: boolean) => {
		collapsed = value;
		writeJsonStorage(STORAGE_KEYS.arcade.menu, { collapsed: value });
	};

	const toggleCollapsed = () => setCollapsed(!collapsed);

	afterNavigate(() => close());

	onMount(() => {
		recordArcadeVisit();
		const parsed = readJsonStorage<{ collapsed?: boolean } | null>(STORAGE_KEYS.arcade.menu, null);
		if (typeof parsed?.collapsed === "boolean") collapsed = parsed.collapsed;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	});

	function cn(...classes: Array<string | false | null | undefined>) {
		return classes.filter(Boolean).join(" ");
	}

	const toastAccent: Record<AchievementCategory, string> = {
		arcade: "border-amber-400/40 shadow-amber-950/30",
		tictactoe: "border-sky-400/40 shadow-sky-950/30",
		sudoku: "border-indigo-400/40 shadow-indigo-950/30",
		snake: "border-emerald-400/40 shadow-emerald-950/30",
		blackjack: "border-rose-400/40 shadow-rose-950/30",
		minesweeper: "border-cyan-400/40 shadow-cyan-950/30"
	};

	$: currentGame = syncLastGameFromPath(normalizePathname($page.url.pathname));
	$: if (currentGame) unlockGameOpened(currentGame.slug);

	$: sidebarWidth = collapsed ? "4.25rem" : "15.5rem";
</script>

<style>
	@media (min-width: 768px) {
		.layout {
			padding-left: calc(var(--sidebar-w) + 0.75rem);
		}
	}
</style>

<aside
	class={cn(
		"hidden md:flex fixed left-3 top-3 bottom-3 z-50",
		"transition-[width] duration-200 ease-out",
		collapsed ? "w-[4.25rem]" : "w-[15.5rem]"
	)}
	style={`--sidebar-w:${sidebarWidth};`}
	aria-label="Primary navigation"
>
	<div class="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-md shadow-lg ring-1 ring-white/10">
		<div
			class={cn(
				"flex-1 p-2",
				"overflow-y-auto",
				"flex flex-col gap-2",
				"[&_a]:flex [&_a]:items-center [&_a]:gap-3",
				"[&_a]:w-full [&_a]:justify-start",
				"[&_a]:rounded-xl [&_a]:px-3 [&_a]:py-2.5",
				"[&_a]:text-sm [&_a]:font-semibold [&_a]:whitespace-nowrap",
				"[&_a]:transition [&_a]:duration-150 [&_a]:active:scale-[0.98]",
				"[&_a]:!text-slate-100",
				"[&_a]:!bg-slate-950/35 [&_a]:backdrop-blur-md",
				"[&_a]:!ring-1 [&_a]:!ring-indigo-400/30",
				"[&_a:hover]:!bg-indigo-500/20",
				"[&_a:hover]:!ring-indigo-300/60",
				"[&_a:hover]:shadow-lg [&_a:hover]:shadow-indigo-500/20",
				"[&_a:hover]:-translate-y-[1px]",
				"[&_a_svg]:opacity-90 [&_a:hover_svg]:opacity-100",
				"[&_a_svg]:transition [&_a_svg]:duration-150",
				collapsed && "[&_a_span]:hidden"
			)}
		>
			<NavBarGames {collapsed} />
		</div>

		<div class="p-2 pt-0">
			<div class="flex flex-col gap-2">
				<a
					href="/"
					class={cn(
						"group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ecba16] to-amber-500 px-3 py-2 text-sm font-bold text-black shadow-sm transition hover:shadow-md active:scale-[0.98]",
						collapsed && "justify-center px-2"
					)}
				>
					{#if normalizePathname($page.url.pathname) === "/"}
						<Zap size="16" class="fill-black stroke-black transition group-hover:scale-110" />
						<span class={cn("block", collapsed && "hidden")}>BKCLB.dev Arcade</span>
					{:else}
						<ArrowBigLeft size="16" class="fill-black stroke-black transition group-hover:scale-110" />
						<span class={cn("block", collapsed && "hidden")}>Return Home</span>
					{/if}
				</a>

				<a
					href="/achievements"
					class={cn(
						"group inline-flex items-center gap-2 rounded-xl bg-slate-950/35 px-3 py-2 text-sm font-bold text-slate-100 ring-1 ring-indigo-400/30 transition hover:bg-indigo-500/20 hover:ring-indigo-300/60 active:scale-[0.98]",
						collapsed && "justify-center px-2"
					)}
				>
					<Trophy size="16" class="stroke-[#ecba16] transition group-hover:scale-110 group-hover:rotate-6" />
					<span class={cn("block", collapsed && "hidden")}>Achievements</span>
				</a>

				<div class="flex flex-row gap-2 justify-between items-stretch">
					<button
						type="button"
						on:click={toggleCollapsed}
						class={cn(
						"inline-flex flex-grow items-center gap-2 rounded-xl px-3 py-2",
						"text-slate-200 transition hover:bg-white/10 active:scale-[0.98]",
						collapsed && "justify-center px-2"
					)}
						aria-label={collapsed ? "Expand menu" : "Collapse menu"}
						aria-pressed={collapsed}
					>
						{#if collapsed}
							<ChevronRight size="18" />
							<span class="hidden">Expand</span>
						{:else}
							<ChevronLeft size="18" />
							<span>Collapse</span>
						{/if}
					</button>
					<a
						href="/about"
						class="group inline-flex items-center gap-2 rounded-xl hover:bg-white/10 px-3 text-sm font-bold text-black transition active:scale-[0.98]"
						class:hidden={collapsed}
					>
						<CircleQuestionMark size={20} class="stroke-indigo-500 group-hover:stroke-[#ecba16] group-hover:rotate-6 transition-all" />
					</a>
				</div>
			</div>
		</div>
	</div>
</aside>

<nav class="fixed inset-x-0 top-3 z-50 px-3 sm:px-6 md:hidden">
	<div class="mx-auto max-w-6xl">
		<div class="flex items-center justify-between rounded-2xl backdrop-blur-md shadow-lg ring-1 ring-black/5 bg-slate-900/60 ring-white/10 px-2 py-2 sm:px-3">
			<a
				href="/"
				class="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ecba16] to-amber-500 px-3 py-2 text-sm font-semibold text-black shadow-sm transition hover:shadow-md active:scale-[0.98]"
				on:click={close}
			>
				{#if normalizePathname($page.url.pathname) === "/"}
					<Zap size="16" class="fill-black stroke-black transition group-hover:scale-110" />
					<span class="hidden sm:block">BKCLB.dev</span>
				{:else}
					<ArrowBigLeft size="16" class="fill-black stroke-black transition group-hover:scale-110" />
					<span class="hidden sm:block">Home</span>
				{/if}
			</a>

			<button
				type="button"
				class="md:hidden inline-flex items-center justify-center rounded-xl px-3 py-2 text-slate-700 transition hover:bg-black/5 active:scale-[0.98] text-slate-200 hover:bg-white/10"
				aria-label={open ? "Close menu" : "Open menu"}
				aria-expanded={open}
				on:click={toggle}
			>
				{#if open}
					<X size="18" />
				{:else}
					<Menu size="18" />
				{/if}
			</button>
		</div>

		{#if open}
			<div class="md:hidden mt-2 rounded-2xl bg-slate-900/70 backdrop-blur-md shadow-lg ring-1 ring-white/10 p-2">
				<a
					href="/achievements"
					class="mb-2 flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-100 transition hover:bg-indigo-500/20 active:scale-[0.99]"
					on:click={close}
				>
					<span class="inline-flex items-center gap-3">
						<Trophy size="18" class="stroke-[#ecba16]" />
						Achievements
					</span>
					<ChevronRight size="16" />
				</a>
				<button
					class={cn(
						"flex flex-row gap-2 flex-wrap",
						"[&_a]:flex [&_a]:items-center [&_a]:justify-between [&_a]:gap-3",
						"[&_a]:rounded-xl [&_a]:px-4 [&_a]:py-3",
						"[&_a]:text-base [&_a]:font-semibold",
						"[&_a]:transition [&_a]:duration-150 [&_a]:active:scale-[0.99]",
						"[&_a:hover]:!bg-indigo-500/20",
						"[&_a:hover]:!ring-indigo-300/60"
					)}
					on:click={close}
				>
					<NavBarGames on:navigate={close} />
				</button>
			</div>
		{/if}
	</div>
</nav>

<div class="layout" style={`--sidebar-w:${sidebarWidth};`}>
	<slot />
</div>

{#if $achievementToasts.length}
	<div class="fixed bottom-4 right-4 z-[80] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 md:bottom-5 md:right-5" aria-live="polite" aria-atomic="false">
		{#each $achievementToasts as toast (toast.id)}
			<section
				class={cn(
					"rounded-2xl border bg-slate-950/90 p-3 text-slate-100 shadow-2xl backdrop-blur-md ring-1 ring-white/10",
					toastAccent[toast.category]
				)}
			>
				<div class="flex items-start gap-3">
					<div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ecba16]/10 ring-1 ring-[#ecba16]/35">
						<Trophy size="20" class="stroke-[#ecba16]" />
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-indigo-300">Achievement unlocked</p>
						<p class="mt-1 truncate text-sm font-semibold text-neutral-100">{toast.title}</p>
						<p class="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">{toast.description}</p>
					</div>
					<button
						type="button"
						class="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-neutral-500 transition hover:bg-white/10 hover:text-neutral-100"
						aria-label="Dismiss achievement notification"
						on:click={() => dismissAchievementToast(toast.id)}
					>
						<X size="14" />
					</button>
				</div>
			</section>
		{/each}
	</div>
{/if}
