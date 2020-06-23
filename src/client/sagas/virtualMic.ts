import {SagaIterator} from "redux-saga";
import {attachVirtualMicrophone, attachMicrophone, muteMicrophone} from "../store/actions";
import {put} from "redux-saga/effects";
import loopedActionChannel from "../../common/sagas/loopedActionChannel";
import assertNever from "../../common/utils/assertNever";

const MIC_ACTIONS = [attachMicrophone, muteMicrophone];
type MIC_ACTIONS = ReturnType<typeof MIC_ACTIONS[number]>;

// eslint-disable-next-line require-yield
function* virtualMicActionHandler(action: MIC_ACTIONS, audioCtx: AudioContext, gain: GainNode) {
	switch (action.type) {
		case 'attachMicrophone':
			gain.gain.value = gain.gain.defaultValue;
			if (action.payload) {
				const source = audioCtx.createMediaStreamSource(action.payload)
				source.connect(gain);
			}
			break;
		case 'muteMicrophone':
			gain.gain.value = action.payload ? 0 : gain.gain.defaultValue;
			break;
		default:
			return assertNever(action);
	}
}


export default function* virtualMicHandler(): SagaIterator {
	const audioCtx = new AudioContext();
	const stream = audioCtx.createMediaStreamDestination();
	const gain = audioCtx.createGain();
	gain.connect(stream);
	yield put(attachVirtualMicrophone(stream.stream));
	yield loopedActionChannel(MIC_ACTIONS, virtualMicActionHandler, {}, audioCtx, gain);
}