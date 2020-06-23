import {SagaIterator} from "redux-saga";
import {take} from "../../common/utils/effects";
import {requestMicrophone, attachMicrophone, requestCamera, attachCamera} from "../store/actions";
import {call, fork, put} from "redux-saga/effects";
import {AnyAction} from "redux";

function getMediaDevice(constrains: MediaStreamConstraints) {
	return window.navigator.mediaDevices.getUserMedia(constrains);
}

function* stream(
	act: { type: string, (...args: any): { type: string, payload: boolean} },
	updateAction: (payload: MediaStream | null) => AnyAction,
	constrains: MediaStreamConstraints
): SagaIterator {
	while(true) {
		const action: { payload: boolean } = yield take([act]);
		if (action.payload === false) {
			yield put(updateAction(null));
		} else {
			try {
				const media = yield call(getMediaDevice, constrains);
				yield put(updateAction(media));
			} catch(e) {
				console.warn(e);
			}
		}
	}
}

export default function* hardwareRequestHandler(): SagaIterator {
	yield fork(stream, requestMicrophone, attachMicrophone, {
		audio: { echoCancellation: true, autoGainControl: true },
		video: false,
	});
	yield fork(stream, requestCamera, attachCamera, {
		audio: false,
		video: { width: 1200, height: 800 },
	});
}