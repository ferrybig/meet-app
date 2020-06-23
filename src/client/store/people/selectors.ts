import MeetingState from "./state";
import createDeepEqualSelector from "../../../common/utils/createDeepEqualSelector";
import {People} from "../types";

const NULL_OBJECT: People = {
	id: '',
	name: 'Unknown user',
	isMuted: true,
	cameraStream: [],
	microphoneStream: [],
	presentationStream: [],
	health: 'disconnected',
}

export default {
	getKnownIds: createDeepEqualSelector(
		(state: MeetingState) => Object.keys(state.entities),
		val => val,
	),
	getKnownIdsWithSelf: createDeepEqualSelector(
		(state: MeetingState) => [...Object.keys(state.entities), null],
		val => val,
	),
	getById(state: MeetingState, id: string) {
		return state.entities[id] || NULL_OBJECT;
	},
};