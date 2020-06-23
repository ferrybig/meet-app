import MeetingState from "./state";
import {People} from "../types";
import createDeepEqualSelector from "../../../common/utils/createDeepEqualSelector";

export default {
	getName(state: MeetingState) {
		return state.account.name;
	},
	getVirtualMicrophoneStream(state: MeetingState) {
		return state.streams.virtualMicrophone;
	},
	getMicrophoneStream(state: MeetingState) {
		return state.streams.microphone;
	},
	getCamaraStream(state: MeetingState) {
		return state.streams.camera;
	},
	getPresentationStream(state: MeetingState) {
		return state.streams.presentation;
	},
	getAsPerson: createDeepEqualSelector(
		(state: MeetingState): People => ({
			id: '',
			name: `${state.account.name} (You)`,
			isMuted: state.muted,
			cameraStream: state.streams.camera?.getTracks() || [],
			microphoneStream: state.streams.microphone?.getTracks() || [],
			presentationStream: state.streams.presentation?.getTracks() || [],
			health: 'healty',
		}),
		val => val,
	),
	getMutedState(state: MeetingState) {
		return state.muted;
	}
};