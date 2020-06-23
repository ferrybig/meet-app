import {newConnection, clientDisconnect} from "../../store/actions";
import {SagaIterator, EventChannel, Channel} from "redux-saga";
import makeWebSocketChannel from "../../../common/sagas/makeWebSocketConnection";
import {call, put, fork} from "redux-saga/effects";
import handleInitialConnection from "./initial";
import timeoutHandler from "./timeoutHandler";


export default function* onNewConnection({ payload: { webSocket, roomId }}: ReturnType<typeof newConnection>, clientId: string): SagaIterator {
	const [incoming, outgoing]: [EventChannel<string>, Channel<string>] = yield call(makeWebSocketChannel, webSocket);
	try {
		yield fork(timeoutHandler, webSocket, clientId);
		let handler = call(handleInitialConnection, incoming, outgoing, roomId, clientId);
		while (handler) {
			handler = yield handler;
		}
	} catch(e) {
		console.error(e); // todo yield action
	} finally {
		yield put(clientDisconnect(roomId, clientId));
		webSocket.terminate();
		outgoing.close();
		incoming.close();
	}
}