import {EventChannel, Channel, SagaIterator} from "redux-saga";
import {StrictEffect, put, call, select} from "redux-saga/effects";
import {InitialServerToClient, InitialClientToServer} from "../../../../common/packets";
import {take} from "../../../../common/utils/effects";
import assertNever from "../../../../common/utils/assertNever";
import handleConnectedConnection from "../connection";
import {getChatPeopleInRoom} from "../../../store/selectors";

export default function* handleInitialConnection(
	incoming: EventChannel<string>,
	outgoing: Channel<string>,
	roomId: string,
	clientId: string
): SagaIterator<StrictEffect> {
	const stringify: (p: InitialServerToClient) => string = JSON.stringify;
	const challenge = '123456';
	let hasPassedVersionCheck = false;
	while(true) {
		const packet: InitialClientToServer = JSON.parse(yield take(incoming));
		switch (packet.type) {
			case 'version':
				hasPassedVersionCheck = true;
				yield put(outgoing, stringify({
					type: 'pre-auth',
					challenge,
				}));
				break;
			case 'pre-auth-response':
				if (!hasPassedVersionCheck) {
					yield put(outgoing, stringify({
						type: 'disconnect',
						reason: 'You have been banned',
					}));
					// Todo ban user
					throw new Error('Protocol error');
				}
				const otherMembers: string[] = yield select(getChatPeopleInRoom, roomId);
				yield put(outgoing, stringify({
					type: 'authorized',
					initialClients: otherMembers,
					iceServers: [
						{
							urls: 'stun:dev.ferrybig.me:3478',
						},
						{
							urls: 'turn:dev.ferrybig.me:3478',
							username: 'testing',
							credential: 'ke1',
							credentialType: 'password',
						},
					],
				}));
				return call(handleConnectedConnection, incoming, outgoing, roomId, clientId, packet.name);
			default:
				return assertNever(packet);
		}

	}
}
