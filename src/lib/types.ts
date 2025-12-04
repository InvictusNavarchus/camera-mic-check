// Media device types
export interface MediaDeviceInfo {
	deviceId: string;
	label: string;
	kind: 'audioinput' | 'videoinput' | 'audiooutput';
}

// Permission status
export type PermissionStatus = 'prompt' | 'granted' | 'denied' | 'unsupported';

// Device test status
export type TestStatus = 'idle' | 'testing' | 'success' | 'error';

// Test result
export interface TestResult {
	status: TestStatus;
	message: string;
	timestamp: Date;
}

// Audio analysis data
export interface AudioAnalysis {
	volume: number;
	peak: number;
	isActive: boolean;
}

// Video analysis data
export interface VideoAnalysis {
	width: number;
	height: number;
	frameRate: number;
	isActive: boolean;
}
