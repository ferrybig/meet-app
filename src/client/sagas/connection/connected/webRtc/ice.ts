import {SagaIterator} from "redux-saga";
import {put} from "redux-saga/effects";
import requestIdleCallback from "../../../../../common/utils/requestIdleCallback";
import {clientOutgoingIce} from "../../../../store/actions";
import onEvent from "../../../../../common/utils/onEvent";
import loopedEventChannel from "../../../../../common/sagas/loopedEventChannel";

function* iceActionHandler(ice: RTCIceCandidateInit[], clientId: string): SagaIterator {
	yield put(clientOutgoingIce(clientId, ice));
}

export default function* iceHandler(connection: RTCPeerConnection, clientId: string): SagaIterator {
	yield loopedEventChannel(emitter => {
		let cancelIdleTimeout = (): void => undefined;
		let candidates: RTCIceCandidateInit[] = [];
		function sendAction() {
			emitter(candidates);
			candidates = [];
		}
		return onEvent(connection, {
			icecandidateerror: (e) => console.warn('ice error', e),
			icecandidate(e) {
				console.log(e, [...candidates]);
				if (e.candidate) {
					candidates.push(e.candidate.toJSON());
					cancelIdleTimeout();
					cancelIdleTimeout = requestIdleCallback(sendAction);
				} else {
					cancelIdleTimeout();
					sendAction();
				}
			},
		}, cancelIdleTimeout);
	}, iceActionHandler, {}, clientId);
}
