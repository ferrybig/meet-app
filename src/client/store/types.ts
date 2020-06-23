
export interface Account {
	expires: number;
	privateKey: string;
	publicKey: string;
	name: string;
	isValid: boolean;
}

export interface PersistState {
	name: string,
}

export interface People {
	id: string;
	name: string;
	isMuted: boolean;
	cameraStream: MediaStreamTrack[];
	microphoneStream: MediaStreamTrack[];
	presentationStream: MediaStreamTrack[];
	health: ClientHealth;
}
export interface MediaInfo {
	trackType: 'main' | 'presentation'
	kind: 'audio' | 'video',
	track: MediaStreamTrack,
	id: number,
}
export type ScreenType = 'initial' | 'account' | 'meeting';
export type ClientHealth = 'healty' | 'pending' | 'disconnected' | 'error';
