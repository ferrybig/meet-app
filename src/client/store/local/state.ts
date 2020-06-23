import { Account } from "../types";

export default interface MeetingState {
	account: Account;
	streams: {
		microphone: MediaStream | null,
		virtualMicrophone: MediaStream | null,
		camera: MediaStream | null,
		presentation: MediaStream | null,
	},
	muted: boolean,
}
export const initialState: Readonly<MeetingState> = {
	account: {
		expires: 0,
		privateKey: '',
		publicKey: '',
		name: '',
		isValid: false,
	},
	streams: {
		microphone: null,
		virtualMicrophone: null,
		camera: null,
		presentation: null,
	},
	muted: false,
};
