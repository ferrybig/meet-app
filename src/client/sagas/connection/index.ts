import {Account} from "../../store/types"
import {Channel, SagaIterator, EventChannel} from "redux-saga";
import {call, put, race, CallEffect} from "redux-saga/effects";
import handleInitialConnection from "./initial";
import {connectionLost, joinedMeeting, endCall} from "../../store/actions";
import makeWebSocketChannel from "../../../common/sagas/makeWebSocketConnection";
import {take} from "../../../common/utils/effects";
import {AnyAction} from "redux";


export default function* openConnection(account: Account): SagaIterator<boolean> {
	yield put(joinedMeeting());
	try {
		const [incoming, outgoing]: [EventChannel<string>, Channel<string>] = yield call(makeWebSocketChannel, 'ws://localhost:5000/meeting');
		try {
			let handler = call(handleInitialConnection, incoming, outgoing, account);
			while (handler) {
				const res: [CallEffect?, AnyAction?] = yield race([handler, take(endCall)]);
				if (res[0]) {
					handler = res[0];
				} else {
					return true;
				}
			}
		} finally {
			outgoing.close();
			incoming.close();
		}
		yield put(connectionLost("Disconnected"))
	} catch(e) {
		console.warn(e);
		yield put(connectionLost(String(e)));
	}
	return false;
}
