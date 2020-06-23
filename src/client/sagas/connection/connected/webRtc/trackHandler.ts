import {SagaIterator, eventChannel, EventChannel} from "redux-saga";
import {take} from "../../../../../common/utils/effects";
import {clientStreamAdded} from "../../../../store/actions";
import {put} from "redux-saga/effects";
import assertNever from "../../../../../common/utils/assertNever";
import onEvent from "../../../../../common/utils/onEvent";

interface SagaTrackEvent {
	type: 'add' | 'remove',
	trackType: 'main' | 'presentation'
	kind: 'audio' | 'video',
	track: MediaStreamTrack,
	id: number,
}

export default function* trackHandler(connection: RTCPeerConnection, clientId: string): SagaIterator<never> {
	const channel: EventChannel<SagaTrackEvent> = eventChannel<SagaTrackEvent>(emitter => {
		let totalId = 0;
		return onEvent(connection, {
			track(e) {
				const track = e.track;
				const kind = track.kind === 'audio' ? 'audio' : 'video';
				const trackType = e.streams.length === 1 ? 'main' : 'presentation';
				const id = totalId++;
				emitter({
					type: 'add',
					trackType,
					kind,
					track,
					id,
				});
				track.addEventListener('ended', () => {
					emitter({
						type: 'remove',
						trackType,
						kind,
						track,
						id,
					});
				});
			},
		});
	});
	while(true) {
		const {
			type,
			...mediaInfo
		}: SagaTrackEvent = yield take(channel);
		switch(type) {
			case 'add':
				yield put(clientStreamAdded(clientId, mediaInfo));
				break;
			case 'remove':
				yield put(clientStreamAdded(clientId, mediaInfo));
				break;
			default:
				return assertNever(type);
		}
	}
}
