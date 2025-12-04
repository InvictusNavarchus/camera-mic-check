<script lang="ts">
	interface Props {
		volume: number;
		isActive: boolean;
		peak: number;
	}

	let { volume, isActive, peak }: Props = $props();

	// Create array for level bars
	const barCount = 20;
	const bars = Array.from({ length: barCount }, (_, i) => i);

	const getBarColor = (index: number, volume: number) => {
		const threshold = (index / barCount) * 100;
		if (volume < threshold) return 'bg-gray-300 dark:bg-gray-600';
		if (index >= barCount * 0.8) return 'bg-red-500';
		if (index >= barCount * 0.6) return 'bg-yellow-500';
		return 'bg-green-500';
	};
</script>

<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
	<h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
		<svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
			/>
		</svg>
		Microphone Level
		{#if isActive}
			<span class="ml-auto flex items-center gap-1">
				<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
				<span class="text-sm font-normal text-green-600 dark:text-green-400">Active</span>
			</span>
		{/if}
	</h2>

	<div class="space-y-4">
		<!-- Main volume bar -->
		<div class="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
			<div
				class="absolute inset-y-0 left-0 transition-all duration-75 rounded-full"
				class:bg-gradient-to-r={isActive}
				class:from-green-400={isActive}
				class:via-yellow-400={isActive && volume > 60}
				class:to-red-500={isActive && volume > 80}
				class:bg-gray-400={!isActive}
				style="width: {isActive ? volume : 0}%"
			></div>
			<div class="absolute inset-0 flex items-center justify-center">
				<span class="text-sm font-semibold text-gray-700 dark:text-gray-200 drop-shadow">
					{isActive ? `${Math.round(volume)}%` : 'Inactive'}
				</span>
			</div>
		</div>

		<!-- Level indicator bars -->
		<div class="flex gap-1 justify-center h-24">
			{#each bars as bar}
				<div class="flex flex-col-reverse gap-0.5 flex-1">
					{#each Array.from({ length: 10 }, (_, i) => i) as segment}
						<div
							class="h-2 rounded-sm transition-colors duration-75 {getBarColor(
								bar,
								isActive ? volume : 0
							)} {segment * 10 > volume ? 'opacity-30' : 'opacity-100'}"
						></div>
					{/each}
				</div>
			{/each}
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-2 gap-4 mt-4">
			<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
				<p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
					Current Level
				</p>
				<p class="text-2xl font-bold text-gray-800 dark:text-white">
					{isActive ? Math.round(volume) : '—'}
					<span class="text-sm font-normal text-gray-500">%</span>
				</p>
			</div>
			<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
				<p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
					Peak Level
				</p>
				<p class="text-2xl font-bold text-gray-800 dark:text-white">
					{isActive ? Math.round(peak) : '—'}
					<span class="text-sm font-normal text-gray-500">%</span>
				</p>
			</div>
		</div>

		<!-- Activity indicator -->
		{#if isActive}
			<div
				class="flex items-center justify-center gap-2 py-2 text-sm {volume > 5
					? 'text-green-600 dark:text-green-400'
					: 'text-gray-500 dark:text-gray-400'}"
			>
				{#if volume > 5}
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					<span>Sound detected - Microphone is working!</span>
				{:else}
					<svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>Try speaking to test your microphone...</span>
				{/if}
			</div>
		{:else}
			<div class="flex items-center justify-center gap-2 py-2 text-sm text-gray-400">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>Start the test to check your microphone</span>
			</div>
		{/if}
	</div>
</div>
