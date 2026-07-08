<script lang="ts">
	import { onMount } from "svelte";
	import { Check, CircleQuestionMark, Lock, Sparkles, Trophy } from "lucide-svelte";
	import { ACHIEVEMENTS, achievements, refreshAchievements, unlockAchievement } from "$lib/achievements";
	import type { AchievementCategory } from "$lib/achievements";

	const categoryOrder: AchievementCategory[] = ["arcade", "tictactoe", "sudoku", "snake", "blackjack", "minesweeper"];

	const categoryMeta: Record<AchievementCategory, { label: string; eyebrow: string; class: string; bar: string }> = {
		arcade: {
			label: "Arcade",
			eyebrow: "Cabinet-wide",
			class: "text-amber-300 border-amber-400/30 bg-amber-500/10",
			bar: "from-[#ecba16] to-amber-400"
		},
		tictactoe: {
			label: "Tic-Tac-Toe",
			eyebrow: "Lines & traps",
			class: "text-sky-300 border-sky-400/30 bg-sky-500/10",
			bar: "from-sky-300 to-emerald-300"
		},
		sudoku: {
			label: "Sudoku",
			eyebrow: "Logic board",
			class: "text-indigo-300 border-indigo-400/30 bg-indigo-500/10",
			bar: "from-indigo-300 to-violet-300"
		},
		snake: {
			label: "Snake",
			eyebrow: "Score chase",
			class: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10",
			bar: "from-emerald-300 to-lime-300"
		},
		blackjack: {
			label: "Blackjack",
			eyebrow: "Cards & chips",
			class: "text-rose-300 border-rose-400/30 bg-rose-500/10",
			bar: "from-rose-300 to-amber-300"
		},
		minesweeper: {
			label: "Minesweeper",
			eyebrow: "Flags & nerve",
			class: "text-cyan-300 border-cyan-400/30 bg-cyan-500/10",
			bar: "from-cyan-300 to-blue-300"
		}
	};

	onMount(() => {
		unlockAchievement("open-achievements");
		refreshAchievements();
	});

	$: unlocked = $achievements.filter((achievement) => achievement.unlocked).length;
	$: percent = Math.round((unlocked / ACHIEVEMENTS.length) * 100);
	$: groupedAchievements = categoryOrder.map((category) => {
		const items = $achievements.filter((achievement) => achievement.category === category);
		const done = items.filter((achievement) => achievement.unlocked).length;
		return {
			category,
			items,
			done,
			total: items.length,
			percent: items.length ? Math.round((done / items.length) * 100) : 0
		};
	});

	const formatUnlockedAt = (value: number | null) => {
		if (!value) return "Locked";
		return new Intl.DateTimeFormat(undefined, {
			month: "short",
			day: "numeric",
			year: "numeric"
		}).format(new Date(value));
	};
</script>

<main class="max-w-[96vw] mx-auto min-h-screen flex flex-col items-center mt-20 md:mt-10 mb-6">
	<section class="relative w-full max-w-7xl">
		<header class="mb-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
			<div class="min-w-0">
				<p class="flex items-center gap-2 text-indigo-300 uppercase tracking-[0.25em] text-xs mb-2">
					<Sparkles size="14" />
					Local progress
				</p>
				<h1 class="flex items-center gap-3 font-impact text-5xl sm:text-6xl tracking-wide bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
					Achievements
				</h1>
				<p class="mt-2 max-w-2xl text-neutral-400 text-sm leading-relaxed">
					Local-only trophies for doing arcade things. No accounts, no leaderboard pressure.
				</p>
			</div>

			<div class="w-full rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-3 lg:w-[22rem]">
				<div class="mb-2 flex items-center justify-between gap-3">
					<p class="text-neutral-200 text-sm font-semibold">{unlocked} / {ACHIEVEMENTS.length} unlocked</p>
					<p class="text-neutral-500 text-xs uppercase tracking-[0.18em]">{percent}%</p>
				</div>
				<div class="h-2 w-full overflow-hidden rounded-full bg-neutral-950/70 ring-1 ring-white/10">
					<div
						class="h-full rounded-full bg-gradient-to-r from-[#ecba16] via-amber-400 to-emerald-400 transition-[width]"
						style={`width:${percent}%`}
					/>
				</div>
			</div>
		</header>

		<section class="grid items-start gap-3 lg:grid-cols-[repeat(auto-fit,minmax(30rem,1fr))]">
			{#each groupedAchievements as group (group.category)}
				<section class="relative overflow-visible rounded-2xl border border-neutral-800 bg-neutral-950/75 p-2 shadow-xl shadow-black/20">
					<div class="relative mb-2">
						<div class="flex min-w-0 items-center gap-2">
							<h2 class="truncate text-base font-semibold text-neutral-100">{categoryMeta[group.category].label}</h2>
							<p class="hidden truncate text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-neutral-600 sm:block">{categoryMeta[group.category].eyebrow}</p>
							<div class={`ml-auto shrink-0 rounded-full border px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] ${categoryMeta[group.category].class}`}>
								{group.done}/{group.total}
							</div>
						</div>
						<div class="mt-1.5 h-1 overflow-hidden rounded-full bg-neutral-900 ring-1 ring-white/10">
							<div class={`h-full rounded-full bg-gradient-to-r ${categoryMeta[group.category].bar}`} style={`width:${group.percent}%`} />
						</div>
					</div>

					<div class="relative grid gap-1.5 sm:grid-cols-2 min-[1120px]:grid-cols-3">
						{#each group.items as achievement, index (achievement.id)}
							<article
								class={`group/card relative overflow-visible rounded-lg border px-2 py-1.5 transition ${
									achievement.unlocked
										? "border-indigo-400/35 bg-gradient-to-br from-neutral-950/75 via-neutral-950/45 to-indigo-950/25 shadow-lg shadow-indigo-950/20"
										: "border-neutral-700/80 bg-neutral-900/95 shadow-md shadow-black/20"
								}`}
							>
								<div
									class={`pointer-events-none absolute inset-x-5 top-0 h-px transition ${
										achievement.unlocked ? "bg-gradient-to-r from-transparent via-[#ecba16]/80 to-transparent" : "bg-transparent"
									}`}
								/>
								<div class="flex min-h-7 items-center justify-between gap-2">
									<h3 class={`min-w-0 flex-1 text-[0.78rem] font-semibold leading-snug ${achievement.unlocked ? "text-neutral-100" : "text-neutral-200"}`}>
										{achievement.title}
									</h3>
									<div class="flex shrink-0 items-center gap-1">
										<div class={`grid h-5 w-5 place-items-center rounded-md ring-1 ${achievement.unlocked ? "bg-emerald-500/10 ring-emerald-400/30" : "bg-neutral-950 ring-neutral-600/70"}`}>
											{#if achievement.unlocked}
												<Check size="12" class="stroke-emerald-300" />
											{:else}
												<Lock size="12" class="stroke-neutral-300" />
											{/if}
										</div>
										<button
											type="button"
											class="peer grid h-5 w-5 place-items-center rounded-md bg-neutral-950 text-neutral-300 ring-1 ring-neutral-600/70 transition hover:text-indigo-200 hover:ring-indigo-300/50 focus:outline-none focus-visible:text-indigo-200 focus-visible:ring-indigo-300/70"
											aria-label={`Achievement clue: ${achievement.description}`}
										>
											<CircleQuestionMark size="12" />
										</button>
										<div class="pointer-events-none absolute right-2 top-10 z-20 w-48 rounded-xl border border-indigo-400/25 bg-slate-950/95 p-3 text-xs leading-relaxed text-neutral-300 opacity-0 shadow-xl shadow-black/30 transition peer-hover:opacity-100 peer-focus:opacity-100">
											<p>{achievement.description}</p>
											<p class="mt-2 text-[0.62rem] uppercase tracking-[0.16em] text-neutral-500">{formatUnlockedAt(achievement.unlockedAt)}</p>
										</div>
									</div>
								</div>
							</article>
						{/each}
					</div>
				</section>
			{/each}
		</section>
	</section>
</main>
