import { SagaIterator, buffers, END } from "redux-saga";
import {AnyAction} from "redux";
import {fork, call, put} from "redux-saga/effects";
import {attachMicrophone, attachCamera, attachPresentation} from "../store/actions";
import loopedActionChannel from "../../common/sagas/loopedActionChannel";
import loopedEventChannel from "../../common/sagas/loopedEventChannel";
import onEvent from "../../common/utils/onEvent";

function killStream(stream: MediaStream) {
	for (const track of stream.getTracks()) {
		track.stop();
	}
}

function* watchStream({ payload: stream}: { payload: MediaStream | null }, actionCreator: (stream: null) => AnyAction): SagaIterator {
	if (!stream || stream.getTracks().length < 1) {
		return;
	}
	try {
		const [firstTrack] = stream.getTracks();
		yield loopedEventChannel(emitter => onEvent(firstTrack, {
			ended() {
				emitter(END);
			},
		}), () => {}, {
			buffer: buffers.sliding(1),
		});
		// If we reach this point, it means the stream has ended while we didn't stop it. This is caused by the browser revoking permissions
		yield put(actionCreator(null));
	} finally {
		yield call(killStream, stream)
	}
}

function* watchEvents(action: {type: string, (stream: null): { type: string, payload: MediaStream | null }}): SagaIterator {
	yield loopedActionChannel([action], watchStream, {
		killLast: true,
		nonBlocking: true,
		buffer: buffers.sliding(1),
	}, action);
}

export default function* streamControlHandler(): SagaIterator {
	yield fork(watchEvents, attachMicrophone);
	yield fork(watchEvents, attachCamera);
	yield fork(watchEvents, attachPresentation);
}