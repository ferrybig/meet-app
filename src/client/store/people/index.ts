import buildReducer from "../../../common/utils/buildReducer";
import {initialState} from "./state";
import * as mainActions from '../actions';
import {People} from "../types";
import assertNever from "../../../common/utils/assertNever";
import doMutation from "../../../common/utils/doMutation";


function addTrack(person: People, track: MediaStreamTrack, key: 'cameraStream' | 'microphoneStream' | 'presentationStream'): People {
	const existingTracks = [...person[key]];
	existingTracks.push(track);
	return {
		...person,
		[key]: existingTracks,
	}
}
function removeTrack(person: People, track: MediaStreamTrack, key: 'cameraStream' | 'microphoneStream' | 'presentationStream'): People {
	const existingTracks = [...person[key]];
	const index = existingTracks.indexOf(track);
	if (index < 0) {
		return person;
	}
	existingTracks.splice(index);
	return {
		...person,
		[key]: existingTracks,
	};
}

export default buildReducer(initialState, mainActions, {
	joinedMeetingSuccess(state, { payload }) {
		return doMutation(state).set('entities', Object.fromEntries(payload.clientIdList.map(id => [id, {
			id,
			name: id,
			isMuted: false,
			cameraStream: [],
			microphoneStream: [],
			presentationStream: [],
			health: 'disconnected',
		}])));
	},
	clientJoin(state, {payload}) {
		return doMutation(state)('entities').set(payload.clientId, {
			id: payload.clientId,
			name: payload.name,
			isMuted: false,
			cameraStream: [],
			microphoneStream: [],
			presentationStream: [],
			health: 'disconnected',
		});
	},
	clientDisconnect(state, {payload}) {
		return doMutation(state)('entities').delete(payload.clientId);
	},
	clientStreamAdded(state, {payload}) {
		return doMutation(state)('entities').update(payload.clientId, (state) => {
			switch(payload.mediaInfo.trackType) {
				case 'main':
					switch (payload.mediaInfo.kind) {
						case 'audio':
							return addTrack(state, payload.mediaInfo.track, 'microphoneStream');
						case 'video':
							return addTrack(state, payload.mediaInfo.track, 'cameraStream');
						default:
							return assertNever(payload.mediaInfo.kind);
					}
				case 'presentation':
					return addTrack(state, payload.mediaInfo.track, 'presentationStream');
				default:
					return assertNever(payload.mediaInfo.trackType);
			}
		});
	},
	clientStreamRemoved(state, {payload}) {
		return doMutation(state)('entities').update(payload.clientId, (state) => {
			switch(payload.mediaInfo.trackType) {
				case 'main':
					switch (payload.mediaInfo.kind) {
						case 'audio':
							return removeTrack(state, payload.mediaInfo.track, 'microphoneStream');
						case 'video':
							return removeTrack(state, payload.mediaInfo.track, 'cameraStream');
						default:
							return assertNever(payload.mediaInfo.kind);
					}
				case 'presentation':
					return removeTrack(state, payload.mediaInfo.track, 'presentationStream');
				default:
					return assertNever(payload.mediaInfo.trackType);
			}
		});
	},
	clientHealth(state, {payload}) {
		return doMutation(state)('entities')(payload.clientId).set('health', payload.health);
	},
});