import type { PermissionStatus, MediaDeviceInfo as DeviceInfo } from './types';

/**
 * Check if browser supports getUserMedia
 */
export function isMediaSupported(): boolean {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Check permission status for camera or microphone
 */
export async function checkPermission(type: 'camera' | 'microphone'): Promise<PermissionStatus> {
	if (!navigator.permissions) {
		return 'unsupported';
	}

	try {
		const result = await navigator.permissions.query({ name: type as PermissionName });
		return result.state as PermissionStatus;
	} catch {
		// Firefox doesn't support querying camera/microphone permissions
		return 'prompt';
	}
}

/**
 * Request media permissions and get stream
 */
export async function requestMediaStream(options: {
	video?: boolean | MediaTrackConstraints;
	audio?: boolean | MediaTrackConstraints;
}): Promise<MediaStream> {
	return navigator.mediaDevices.getUserMedia(options);
}

/**
 * Get list of available media devices
 */
export async function getMediaDevices(): Promise<DeviceInfo[]> {
	const devices = await navigator.mediaDevices.enumerateDevices();
	return devices
		.filter((d) => ['audioinput', 'videoinput', 'audiooutput'].includes(d.kind))
		.map((d) => ({
			deviceId: d.deviceId,
			label: d.label || `${d.kind} (${d.deviceId.slice(0, 8)}...)`,
			kind: d.kind as DeviceInfo['kind']
		}));
}

/**
 * Stop all tracks in a media stream
 */
export function stopMediaStream(stream: MediaStream | null): void {
	if (stream) {
		stream.getTracks().forEach((track) => track.stop());
	}
}

/**
 * Create audio analyzer from stream
 */
export function createAudioAnalyzer(stream: MediaStream): {
	analyser: AnalyserNode;
	dataArray: Uint8Array<ArrayBuffer>;
	audioContext: AudioContext;
} {
	const audioContext = new AudioContext();
	const analyser = audioContext.createAnalyser();
	const source = audioContext.createMediaStreamSource(stream);

	analyser.fftSize = 256;
	analyser.smoothingTimeConstant = 0.8;
	source.connect(analyser);

	const dataArray = new Uint8Array(analyser.frequencyBinCount);

	return { analyser, dataArray, audioContext };
}

/**
 * Get current audio level (0-100)
 */
export function getAudioLevel(analyser: AnalyserNode, dataArray: Uint8Array<ArrayBuffer>): number {
	analyser.getByteFrequencyData(dataArray);
	const sum = dataArray.reduce((a, b) => a + b, 0);
	const average = sum / dataArray.length;
	return Math.min(100, Math.round((average / 255) * 100 * 2));
}

/**
 * Get video track settings
 */
export function getVideoSettings(stream: MediaStream): {
	width: number;
	height: number;
	frameRate: number;
} | null {
	const videoTrack = stream.getVideoTracks()[0];
	if (!videoTrack) return null;

	const settings = videoTrack.getSettings();
	return {
		width: settings.width || 0,
		height: settings.height || 0,
		frameRate: settings.frameRate || 0
	};
}
