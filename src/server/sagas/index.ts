import {SagaIterator} from "redux-saga";
import {newConnection} from "../store/actions";
import onNewConnection from "./child";
import {take} from "../../common/utils/effects";
import {spawn} from "redux-saga/effects";
import { v4 as uuidv4 } from 'uuid';

export default function* mainSaga(): SagaIterator {
	while(true) {
		const action: ReturnType<typeof newConnection> = yield take(newConnection);
		const clientId = uuidv4();
		yield spawn(onNewConnection, action, clientId);
	}
}
