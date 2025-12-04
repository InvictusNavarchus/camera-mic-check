<script lang="ts">
	import type { PermissionStatus } from '$lib/types';

	interface Props {
		cameraPermission: PermissionStatus;
		micPermission: PermissionStatus;
		onRequestPermissions: () => void;
	}

	let { cameraPermission, micPermission, onRequestPermissions }: Props = $props();

	const getStatusColor = (status: PermissionStatus) => {
		switch (status) {
			case 'granted':
				return 'text-green-500';
			case 'denied':
				return 'text-red-500';
			case 'prompt':
				return 'text-yellow-500';
			default:
				return 'text-gray-500';
		}
	};

	const getStatusIcon = (status: PermissionStatus) => {
		switch (status) {
			case 'granted':
				return '✓';
			case 'denied':
				return '✕';
			case 'prompt':
				return '?';
			default:
				return '—';
		}
	};

	const getStatusText = (status: PermissionStatus) => {
		switch (status) {
			case 'granted':
				return 'Granted';
			case 'denied':
				return 'Denied';
			case 'prompt':
				return 'Not requested';
			default:
				return 'Not supported';
		}
	};
</script>

<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
	<h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
		<svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
			/>
		</svg>
		Permissions Status
	</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
		<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
			<div class="flex items-center gap-3">
				<div class="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
					<svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<span class="font-medium text-gray-700 dark:text-gray-200">Camera</span>
			</div>
			<div class="flex items-center gap-2">
				<span class={`text-xl font-bold ${getStatusColor(cameraPermission)}`}>
					{getStatusIcon(cameraPermission)}
				</span>
				<span class="text-sm text-gray-500 dark:text-gray-400">
					{getStatusText(cameraPermission)}
				</span>
			</div>
		</div>

		<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
			<div class="flex items-center gap-3">
				<div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
					<svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
						/>
					</svg>
				</div>
				<span class="font-medium text-gray-700 dark:text-gray-200">Microphone</span>
			</div>
			<div class="flex items-center gap-2">
				<span class={`text-xl font-bold ${getStatusColor(micPermission)}`}>
					{getStatusIcon(micPermission)}
				</span>
				<span class="text-sm text-gray-500 dark:text-gray-400">
					{getStatusText(micPermission)}
				</span>
			</div>
		</div>
	</div>

	{#if cameraPermission !== 'granted' || micPermission !== 'granted'}
		<button
			onclick={onRequestPermissions}
			class="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
				/>
			</svg>
			Request Permissions
		</button>
	{:else}
		<div class="flex items-center justify-center gap-2 py-3 text-green-600 dark:text-green-400">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<span class="font-medium">All permissions granted</span>
		</div>
	{/if}
</div>
