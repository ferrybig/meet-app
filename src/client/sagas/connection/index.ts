import {Account} from "../../store/types"
import {Channel, SagaIterator, EventChannel} from "redux-saga";
import {call, put, race, StrictEffect, CallEffect} from "redux-saga/effects";
import handleInitialConnection from "./initial";
import {connectionLost, joinedMeeting, endCall} from "../../store/actions";
import makeWebSocketChannel from "../../../common/sagas/makeWebSocketConnection";
import {take} from "../../../common/utils/effects";
import {AnyAction} from "redux";


export default function* openConnection(account: Account): SagaIterator<boolean> {
	yield put(joinedMeeting());
	const [incoming, outgoing]: [EventChannel<string>, Channel<string>] = yield call(makeWebSocketChannel, 'ws://localhost:3000/meeting');
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
	} catch(e) {
		yield put(connectionLost(e))
	} finally {
		yield put(connectionLost("Disconnected"))
		outgoing.close();
		incoming.close();
	}
	return false;
}
