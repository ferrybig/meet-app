import {EventChannel, Channel, SagaIterator} from "redux-saga";
import {StrictEffect, put, fork, actionChannel, cancel, select} from "redux-saga/effects";
import {ConnectedClientToServer, ConnectedServerToClient} from "../../../../common/packets";
import {take} from "../../../../common/utils/effects";
import assertNever from "../../../../common/utils/assertNever";
import {clientOutgoingIce, clientOutgoingSdp, clientJoin, clientDisconnect, clientPing, clientRequestSdp} from "../../../store/actions";
import {AnyAction} from "redux";
import {getChatPeopleInRoom, getPersonOrNull} from "../../../store/selectors";
import {Connection} from "../../../store/types";

const EVENTS_CHILD = [
	clientOutgoingIce,
	clientOutgoingSdp,
	clientRequestSdp,
	clientJoin,
	clientDisconnect,
	clientPing,
]
type EVENTS_CHILD = ReturnType<typeof EVENTS_CHILD[number]>;

function* connectionDispatcher(clientId: string, roomId: string, sendMessage: (p: ConnectedServerToClient) => StrictEffect) {

	const channel: Channel<EVENTS_CHILD> = yield (() => {
		const map: Record<string, true> = {};
		for(const action of EVENTS_CHILD) {
			map[action.type] = true;
		}
		function isMatchedAction(action: AnyAction): action is EVENTS_CHILD {
			return map[action.type];
		}
		return actionChannel((action: AnyAction): boolean => {
			if (!isMatchedAction(action)) {
				return false;
			}
			if ('payload' in action) {
				if ('roomId' in action.payload) {
					return action.payload.roomId === roomId;
				} else if ('clientId' in action.payload) {
					return action.payload.clientId === clientId;
				} else {
					return assertNever(action.payload);
				}
			} else {
				return assertNever(action);
			}
		});
	})();

	while (true) {
		const action: EVENTS_CHILD = yield take(channel);
		console.log(clientId, 'executing event actions', action)
		switch (action.type) {
			case 'clientOutgoingIce':
				yield sendMessage({
					type: 'client-ice',
					ice: action.payload.ice,
					clientId: action.payload.sourceClientId,
				})
				break;
			case 'clientOutgoingSdp':
				yield sendMessage({
					type: 'client-sdp',
					sdp: action.payload.sdp,
					clientId: action.payload.sourceClientId,
					isOffer: action.payload.isOffer,
				});
				break;
			case 'clientRequestSdp':
				yield sendMessage({
					type: 'client-sdp-request',
					clientId: action.payload.sourceClientId,
				});
				break;
			case 'clientPing':
				yield sendMessage({
					type: 'ping',
					data: 1, // Todo send unique value
				});
				break;
			case 'clientJoin':
				yield sendMessage({
					type: 'client-join',
					clientId: action.payload.clientId,
					name: action.payload.name,
					shouldOfferSDP: true, // Todo better planning who makes the offer
				});
				break;
			case 'clientDisconnect':
				yield sendMessage({
					type: 'client-disconnect',
					clientId: action.payload.clientId,
				});
				break;
			default:
				return assertNever(action);
		}
	}
}


function* startConnectedSagas(clientId: string, roomId: string, sendMessage: (p: ConnectedServerToClient) => StrictEffect) {
	yield fork(connectionDispatcher, clientId, roomId, sendMessage);
}

export default function* handleConnectedConnection(
	incoming: EventChannel<string>,
	outgoing: Channel<string>,
	roomId: string,
	clientId: string,
	name: string,
): SagaIterator<StrictEffect> {
	yield put(clientJoin(roomId, clientId, name));

	const sendPacket = (p: ConnectedServerToClient) => put(outgoing, JSON.stringify(p));
	const task = yield fork(startConnectedSagas, clientId, roomId, sendPacket);

	const otherMembers: string[] = yield select(getChatPeopleInRoom, roomId);
	for (const member of otherMembers) {
		if (member === clientId) {
			continue;
		}
		const person: Connection | null = yield select(getPersonOrNull, member);
		if (!person) {
			console.warn('member ' + member + ' does not exists');
			continue;
		}
		yield sendPacket({
			type: 'client-join',
			clientId: member,
			name: person.name,
			shouldOfferSDP: false,
		});
	}

	try {
		while(true) {
			const packet: ConnectedClientToServer = JSON.parse(yield take(incoming));
			switch (packet.type) {
				case 'client-ice':
					yield put(clientOutgoingIce(clientId, packet.clientId, packet.ice));
					break;
				case 'client-sdp':
					yield put(clientOutgoingSdp(clientId, packet.clientId, packet.sdp, packet.isOffer));
					break;
				case 'client-sdp-request':
					yield put(clientRequestSdp(clientId, packet.clientId));
					break;
				case 'pong':
					break;
				default:
					return assertNever(packet);
			}

		}
	} finally {
		yield cancel(task);
	}
}
