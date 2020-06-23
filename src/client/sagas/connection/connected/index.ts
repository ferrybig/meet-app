import {StrictEffect, fork, put, cancel} from "redux-saga/effects";
import {clientOutgoingSdp, clientOutgoingIce, clientJoin, clientIncomingIce, clientIncomingSdp, clientDisconnect, connectionLost} from "../../../store/actions";
import assertNever from "../../../../common/utils/assertNever";
import {EventChannel, Channel, SagaIterator} from "redux-saga";
import {take} from "../../../../common/utils/effects";
import webRtcHandler from "./webRtc";
import {ConnectedClientToServer, ConnectedServerToClient} from "../../../../common/packets";

function* connectionDispatcher(sendMessage: (p: ConnectedClientToServer) => StrictEffect) {
	const actions = [
		clientOutgoingSdp,
		clientOutgoingIce,
	];
	while (true) {
		const action: ReturnType<typeof actions[number]> = yield take(actions);
		switch (action.type) {
			case 'clientOutgoingSdp':
				yield sendMessage({
					type: 'client-sdp',
					clientId: action.payload.clientId,
					sdp: action.payload.sdp,
					isOffer: action.payload.isOffer,
				});
				break;
			case 'clientOutgoingIce':
				yield sendMessage({
					type: 'client-ice',
					clientId: action.payload.clientId,
					ice: action.payload.ice,
				});
				break;
			default:
				return assertNever(action);
		}
	}
}

function* startConnectedSagas(sendMessage: (p: ConnectedClientToServer) => StrictEffect) {
	yield fork(connectionDispatcher, sendMessage);
	yield fork(webRtcHandler);
}

export default function* connected(
	incoming: EventChannel<string>,
	outgoing: Channel<string>
): SagaIterator<StrictEffect> {
	const sendPacket = (p: ConnectedClientToServer) => put(outgoing, JSON.stringify(p));
	const task = yield fork(startConnectedSagas, sendPacket);
	try {
		while(true) {
			const packet: ConnectedServerToClient = JSON.parse(yield take(incoming));
			switch (packet.type) {
				case 'client-join':
					yield put(clientJoin(packet.clientId, packet.name, packet.shouldOfferSDP));
					break;
				case 'client-ice':
					yield put(clientIncomingIce(packet.clientId, packet.ice));
					break;
				case 'client-sdp':
					yield put(clientIncomingSdp(packet.clientId, packet.sdp, packet.isOffer));
					break;
				case 'client-disconnect':
					yield put(clientDisconnect(packet.clientId));
					break;
				case 'disconnect':
					yield put(connectionLost(packet.reason));
					break;
				case 'ping':
					yield sendPacket({
						type: 'pong',
						data: packet.data,
					})
					break;
				default:
					return assertNever(packet);
			}
		}
	} finally {
		yield cancel(task);
	}
}