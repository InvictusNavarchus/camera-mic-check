<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		stream: MediaStream | null;
		isActive: boolean;
		resolution: { width: number; height: number } | null;
	}

	let { stream, isActive, resolution }: Props = $props();

	let videoElement: HTMLVideoElement | undefined = $state();

	$effect(() => {
		if (videoElement && stream) {
			videoElement.srcObject = stream;
		}
	});

	onMount(() => {
		return () => {
			if (videoElement) {
				videoElement.srcObject = null;
			}
		};
	});
</script>

<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
	<h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
		<svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
			/>
		</svg>
		Camera Preview
		{#if isActive}
			<span class="ml-auto flex items-center gap-1">
				<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
				<span class="text-sm font-normal text-green-600 dark:text-green-400">Live</span>
			</span>
		{/if}
	</h2>

	<div class="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
		{#if stream && isActive}
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<video
				bind:this={videoElement}
				autoplay
				playsinline
				muted
				class="w-full h-full object-cover"
			/>

			{#if resolution}
				<div
					class="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm font-mono"
				>
					{resolution.width} × {resolution.height}
				</div>
			{/if}

			<div
				class="absolute top-3 right-3 px-3 py-1 bg-red-500/90 backdrop-blur-sm rounded-lg text-white text-sm font-medium flex items-center gap-1"
			>
				<span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
				REC
			</div>
		{:else}
			<div class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
				<svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
				<p class="text-center">Camera preview will appear here</p>
				<p class="text-sm opacity-60 mt-1">Start the test to see your camera</p>
			</div>
		{/if}
	</div>
</div>
