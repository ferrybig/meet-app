import {Account} from "../../../store/types"
import {EventChannel, Channel, SagaIterator} from "redux-saga";
import {StrictEffect, put, call} from "redux-saga/effects";
import {connectionLost, joinedMeetingSuccess} from "../../../store/actions";
import connected from "../connected";
import assertNever from "../../../../common/utils/assertNever";
import {take} from "../../../../common/utils/effects";
import {InitialClientToServer, InitialServerToClient} from "../../../../common/packets";

export default function* handleInitialConnection(
	incoming: EventChannel<string>,
	outgoing: Channel<string>,
	account: Account
): SagaIterator<StrictEffect> {
				console.log('handleInitialConnection ');
	const stringify: (p: InitialClientToServer) => string = JSON.stringify;
	yield put(outgoing, stringify({
		type: 'version',
		version: '1.0.0', // Todo proper version string
	}));
	while(true) {
		const packet: InitialServerToClient = JSON.parse(yield take(incoming));
		switch (packet.type) {
			case 'pre-auth':
				yield put(outgoing, stringify({
					type: 'pre-auth-response',
					name: account.name,
					publicKey: account.publicKey,
					response: ''
				}));
				break;
			case 'disconnect':
				yield put(connectionLost(packet.reason));
				break;
			case 'authorized':
				yield put(joinedMeetingSuccess(packet.initialClients, packet.iceServers));
				return call(connected, incoming, outgoing);
			default:
				return assertNever(packet);
		}

	}
}
