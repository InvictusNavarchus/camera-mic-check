<script lang="ts">
	import type { MediaDeviceInfo } from '$lib/types';

	interface Props {
		devices: MediaDeviceInfo[];
		selectedCameraId: string;
		selectedMicId: string;
		onCameraChange: (deviceId: string) => void;
		onMicChange: (deviceId: string) => void;
	}

	let { devices, selectedCameraId, selectedMicId, onCameraChange, onMicChange }: Props = $props();

	let cameras = $derived(devices.filter((d) => d.kind === 'videoinput'));
	let microphones = $derived(devices.filter((d) => d.kind === 'audioinput'));
</script>

<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
	<h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
		<svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
			/>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
		Device Selection
	</h2>

	<div class="space-y-4">
		<div>
			<label
				for="camera-select"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
			>
				<div class="flex items-center gap-2">
					<svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
					Camera
				</div>
			</label>
			<select
				id="camera-select"
				value={selectedCameraId}
				onchange={(e) => onCameraChange(e.currentTarget.value)}
				class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
			>
				{#if cameras.length === 0}
					<option value="">No cameras found</option>
				{:else}
					{#each cameras as camera}
						<option value={camera.deviceId}>{camera.label}</option>
					{/each}
				{/if}
			</select>
		</div>

		<div>
			<label for="mic-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				<div class="flex items-center gap-2">
					<svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
						/>
					</svg>
					Microphone
				</div>
			</label>
			<select
				id="mic-select"
				value={selectedMicId}
				onchange={(e) => onMicChange(e.currentTarget.value)}
				class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
			>
				{#if microphones.length === 0}
					<option value="">No microphones found</option>
				{:else}
					{#each microphones as mic}
						<option value={mic.deviceId}>{mic.label}</option>
					{/each}
				{/if}
			</select>
		</div>
	</div>

	{#if devices.length === 0}
		<p class="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
			Grant permissions to see available devices
		</p>
	{/if}
</div>
