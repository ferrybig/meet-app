import {SagaIterator, eventChannel, EventChannel, buffers} from "redux-saga";
import {take} from "../../../../../common/utils/effects";
import {put, call, apply} from "redux-saga/effects";
import {clientOutgoingSdp, clientIncomingSdp} from "../../../../store/actions";
import onEvent from "../../../../../common/utils/onEvent";

export default function* negotiationHandler(connection: RTCPeerConnection, clientId: string, shouldOffer: boolean): SagaIterator<never> {


	if (!shouldOffer) {
		yield take(clientIncomingSdp.asFilter(a => a.payload.clientId === clientId));
	}
	const channel: EventChannel<true> = eventChannel<true>(emitter => {
		function negotiationneeded() {
			emitter(true);
		}
		if (shouldOffer) {
			negotiationneeded();
		}
		return onEvent(connection, { negotiationneeded });
	}, buffers.dropping(1));


	while(true) {
		yield take(channel);
		const sdp = yield call(() => connection.createOffer());
		yield apply(connection, connection.setLocalDescription, [sdp]);
		yield put(clientOutgoingSdp(clientId, sdp, true));
	}
}