<script lang="ts">
	import { onMount } from 'svelte';
	import PermissionStatus from '$lib/components/PermissionStatus.svelte';
	import DeviceSelector from '$lib/components/DeviceSelector.svelte';
	import CameraPreview from '$lib/components/CameraPreview.svelte';
	import AudioMeter from '$lib/components/AudioMeter.svelte';
	import TestControls from '$lib/components/TestControls.svelte';
	import type { PermissionStatus as PermStatus, MediaDeviceInfo } from '$lib/types';
	import {
		isMediaSupported,
		checkPermission,
		requestMediaStream,
		getMediaDevices,
		stopMediaStream,
		createAudioAnalyzer,
		getAudioLevel,
		getVideoSettings
	} from '$lib/media-utils';

	// State
	let isSupported = $state(true);
	let cameraPermission = $state<PermStatus>('prompt');
	let micPermission = $state<PermStatus>('prompt');
	let devices = $state<MediaDeviceInfo[]>([]);
	let selectedCameraId = $state('');
	let selectedMicId = $state('');
	let isTestRunning = $state(false);
	let stream = $state<MediaStream | null>(null);
	let volume = $state(0);
	let peakVolume = $state(0);
	let resolution = $state<{ width: number; height: number } | null>(null);
	let errorMessage = $state('');

	// Audio analysis refs
	let audioContext: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let dataArray: Uint8Array<ArrayBuffer> | null = null;
	let animationFrameId: number | null = null;

	// Check for browser support and permissions on mount
	onMount(() => {
		if (!isMediaSupported()) {
			isSupported = false;
			return;
		}

		checkPermissions();

		// Listen for device changes
		navigator.mediaDevices.addEventListener('devicechange', refreshDevices);

		return () => {
			navigator.mediaDevices.removeEventListener('devicechange', refreshDevices);
			stopTest();
		};
	});

	async function checkPermissions() {
		cameraPermission = await checkPermission('camera');
		micPermission = await checkPermission('microphone');

		// If already granted, get devices
		if (cameraPermission === 'granted' || micPermission === 'granted') {
			await refreshDevices();
		}
	}

	async function refreshDevices() {
		try {
			devices = await getMediaDevices();

			// Auto-select first device if not selected
			const cameras = devices.filter((d) => d.kind === 'videoinput');
			const mics = devices.filter((d) => d.kind === 'audioinput');

			if (!selectedCameraId && cameras.length > 0) {
				selectedCameraId = cameras[0].deviceId;
			}
			if (!selectedMicId && mics.length > 0) {
				selectedMicId = mics[0].deviceId;
			}
		} catch (err) {
			console.error('Error refreshing devices:', err);
		}
	}

	async function requestPermissions() {
		errorMessage = '';
		try {
			const tempStream = await requestMediaStream({ video: true, audio: true });
			stopMediaStream(tempStream);

			cameraPermission = 'granted';
			micPermission = 'granted';

			await refreshDevices();
		} catch (err) {
			console.error('Permission request failed:', err);
			if (err instanceof Error) {
				if (err.name === 'NotAllowedError') {
					errorMessage = 'Permissions denied. Please allow camera and microphone access in your browser settings.';
				} else if (err.name === 'NotFoundError') {
					errorMessage = 'No camera or microphone found. Please connect a device and try again.';
				} else {
					errorMessage = `Error: ${err.message}`;
				}
			}
			await checkPermissions();
		}
	}

	async function startTest() {
		errorMessage = '';
		try {
			const constraints: MediaStreamConstraints = {
				video: selectedCameraId ? { deviceId: { exact: selectedCameraId } } : true,
				audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true
			};

			stream = await requestMediaStream(constraints);
			isTestRunning = true;

			// Get video resolution
			const videoSettings = getVideoSettings(stream);
			if (videoSettings) {
				resolution = { width: videoSettings.width, height: videoSettings.height };
			}

			// Setup audio analysis
			const audioAnalysis = createAudioAnalyzer(stream);
			audioContext = audioAnalysis.audioContext;
			analyser = audioAnalysis.analyser;
			dataArray = audioAnalysis.dataArray;

			// Start volume monitoring
			startVolumeMonitoring();
		} catch (err) {
			console.error('Failed to start test:', err);
			if (err instanceof Error) {
				errorMessage = `Failed to start test: ${err.message}`;
			}
			isTestRunning = false;
		}
	}

	function stopTest() {
		stopMediaStream(stream);
		stream = null;
		isTestRunning = false;
		volume = 0;
		peakVolume = 0;
		resolution = null;

		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}

		if (audioContext) {
			audioContext.close();
			audioContext = null;
		}

		analyser = null;
		dataArray = null;
	}

	function startVolumeMonitoring() {
		function updateVolume() {
			if (analyser && dataArray) {
				volume = getAudioLevel(analyser, dataArray);
				if (volume > peakVolume) {
					peakVolume = volume;
				}
			}
			animationFrameId = requestAnimationFrame(updateVolume);
		}
		updateVolume();
	}

	function handleCameraChange(deviceId: string) {
		selectedCameraId = deviceId;
		if (isTestRunning) {
			// Restart test with new device
			stopTest();
			startTest();
		}
	}

	function handleMicChange(deviceId: string) {
		selectedMicId = deviceId;
		if (isTestRunning) {
			// Restart test with new device
			stopTest();
			startTest();
		}
	}
</script>

<svelte:head>
	<title>Camera & Mic Test | Check Your Devices</title>
	<meta
		name="description"
		content="Test your camera and microphone online. Check if your devices are working properly before video calls or recordings."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
	<!-- Header -->
	<header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
		<div class="max-w-6xl mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<div>
						<h1 class="text-xl font-bold text-gray-800 dark:text-white">Device Checker</h1>
						<p class="text-sm text-gray-500 dark:text-gray-400">Camera & Microphone Test</p>
					</div>
				</div>
				<div class="flex items-center gap-2">
					{#if isTestRunning}
						<span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium rounded-full flex items-center gap-1">
							<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
							Testing
						</span>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-6xl mx-auto px-4 py-8">
		{#if !isSupported}
			<!-- Unsupported browser message -->
			<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
				<svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<h2 class="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Browser Not Supported</h2>
				<p class="text-red-600 dark:text-red-300">
					Your browser doesn't support media device access. Please use a modern browser like Chrome,
					Firefox, Safari, or Edge.
				</p>
			</div>
		{:else}
			<!-- Error message -->
			{#if errorMessage}
				<div
					class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-start gap-3"
				>
					<svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<div>
						<p class="text-red-700 dark:text-red-300 font-medium">Error</p>
						<p class="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
					</div>
					<button
						onclick={() => (errorMessage = '')}
						class="ml-auto text-red-400 hover:text-red-600 dark:hover:text-red-200"
						aria-label="Dismiss error"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			{/if}

			<!-- Permission Status -->
			<PermissionStatus
				{cameraPermission}
				{micPermission}
				onRequestPermissions={requestPermissions}
			/>

			<!-- Device Selection -->
			<DeviceSelector
				{devices}
				{selectedCameraId}
				{selectedMicId}
				onCameraChange={handleCameraChange}
				onMicChange={handleMicChange}
			/>

			<!-- Test Controls -->
			{#if cameraPermission === 'granted' && micPermission === 'granted'}
				<TestControls isRunning={isTestRunning} onStart={startTest} onStop={stopTest} />
			{/if}

			<!-- Preview Grid -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<CameraPreview {stream} isActive={isTestRunning} {resolution} />
				<AudioMeter {volume} isActive={isTestRunning} peak={peakVolume} />
			</div>

			<!-- Tips Section -->
			<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-6">
				<h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
					<svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
						/>
					</svg>
					Tips for Best Results
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
						<div class="flex items-center gap-2 mb-2">
							<span class="p-1.5 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
								<svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</span>
							<h3 class="font-medium text-gray-800 dark:text-white">Good Lighting</h3>
						</div>
						<p class="text-sm text-gray-600 dark:text-gray-300">
							Position yourself facing a light source for best camera quality.
						</p>
					</div>
					<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
						<div class="flex items-center gap-2 mb-2">
							<span class="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-lg">
								<svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
									/>
								</svg>
							</span>
							<h3 class="font-medium text-gray-800 dark:text-white">Quiet Environment</h3>
						</div>
						<p class="text-sm text-gray-600 dark:text-gray-300">
							Test in a quiet room to accurately measure microphone sensitivity.
						</p>
					</div>
					<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
						<div class="flex items-center gap-2 mb-2">
							<span class="p-1.5 bg-green-100 dark:bg-green-900 rounded-lg">
								<svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
							</span>
							<h3 class="font-medium text-gray-800 dark:text-white">Check Permissions</h3>
						</div>
						<p class="text-sm text-gray-600 dark:text-gray-300">
							Ensure browser permissions are granted for camera and microphone.
						</p>
					</div>
				</div>
			</div>
		{/if}
	</main>

	<!-- Footer -->
	<footer class="border-t border-gray-200 dark:border-gray-700 mt-12 py-8">
		<div class="max-w-6xl mx-auto px-4 text-center">
			<p class="text-gray-500 dark:text-gray-400 text-sm">
				Your privacy is protected. All media processing happens locally in your browser.
			</p>
			<p class="text-gray-400 dark:text-gray-500 text-xs mt-2">
				No data is sent to any server. 🔒
			</p>
		</div>
	</footer>
</div>

