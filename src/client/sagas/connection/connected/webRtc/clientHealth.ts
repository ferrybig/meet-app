import {SagaIterator} from "redux-saga";
import {put} from "redux-saga/effects";
import loopedEventChannel from "../../../../../common/sagas/loopedEventChannel";
import onEvent from "../../../../../common/utils/onEvent";
import {clientHealth} from "../../../../store/actions";
import assertNever from "../../../../../common/utils/assertNever";
import {ClientHealth} from "../../../../store/types";


function* clientHealthActionHandler(health: ClientHealth, clientId: string): SagaIterator {
	return yield put(clientHealth(clientId, health));
}

export default function* clientHealthHandler(connection: RTCPeerConnection, clientId: string): SagaIterator {
	yield loopedEventChannel(emitter => onEvent(connection, {
//		connectionstatechange(e) {
//			switch(connection.connectionState) {
//				case 'new':
//				case 'disconnected':
//				case 'closed':
//					emitter('disconnected');
//					break;
//				case 'connecting':
//					emitter('pending');
//					break;
//				case 'connected':
//					emitter('healty');
//					break;
//				case 'failed':
//					emitter('error');
//					break;
//				default:
//					return assertNever(connection.connectionState);
//			}
//		},
		iceconnectionstatechange(e) {
			switch (connection.iceConnectionState) {
				case 'new':
				case 'closed':
					emitter('disconnected');
					break;
				case 'disconnected':
				case 'checking':
					emitter('pending');
					break;
				case 'connected':
				case 'completed':
					emitter('healty');
					break;
				case 'failed':
					emitter('error');
					break;
				default:
					return assertNever(connection.iceConnectionState);
			}
		},
	}), clientHealthActionHandler, {}, clientId);
}
