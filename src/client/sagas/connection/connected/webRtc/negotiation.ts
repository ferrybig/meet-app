import {SagaIterator, eventChannel, EventChannel, buffers} from "redux-saga";
import {take} from "../../../../../common/utils/effects";
import {put, delay, apply} from "redux-saga/effects";
import {clientIncomingSdp, clientNegotiationNeeded} from "../../../../store/actions";
import onEvent from "../../../../../common/utils/onEvent";
import {NEGOTIATION_STREAM_ID} from "../../../../../common/constants";
import composeEffectHandlers from "../../../../../common/utils/composeEffectHandlers";

export default function* negotiationHandler(connection: RTCPeerConnection, clientId: string, shouldOffer: boolean): SagaIterator<never> {
	if (!shouldOffer) {
		yield take(clientIncomingSdp.asFilter(a => a.payload.clientId === clientId));
	}
	const channel: EventChannel<true> = eventChannel<true>(emitter => {
		if (shouldOffer) {
			emitter(true);
		}
		return composeEffectHandlers(
			onEvent(connection, {
				negotiationneeded() {
					emitter(true);
					console.log('negotiationneeded');
				},
			}),
		);
	}, buffers.dropping(1));

	while(true) {
		yield take(channel);
		yield put(clientNegotiationNeeded(clientId));
		yield delay(1000);
	}
}