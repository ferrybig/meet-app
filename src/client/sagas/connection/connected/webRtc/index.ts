import {SagaIterator, Task} from "redux-saga";
import {clientDisconnect, clientJoin} from "../../../../store/actions";
import {cancel, fork, } from "redux-saga/effects";
import assertNever from "../../../../../common/utils/assertNever";
import {take} from "../../../../../common/utils/effects";
import childHandler from "./child";

const EVENTS_PARENT = [
	clientJoin,
	clientDisconnect,
];

type EVENTS_PARENT = ReturnType<typeof EVENTS_PARENT[number]>;


function* killChild(task: Task) {
	yield cancel(task);
}

export default function* webRtcHandler(): SagaIterator {
	const children = new Map<string, Task>();
	try {
		while(true) {
			const action: EVENTS_PARENT = yield take(EVENTS_PARENT);
			switch (action.type) {
				case 'clientJoin': {
					const clientId = action.payload.clientId;
					const existing = children.get(clientId);
					if (existing) {
						yield* killChild(existing);
					}
					const task: Task = yield fork(childHandler, clientId, action.payload.shouldOffer);
					children.set(clientId, task);
					break;
				}
				case 'clientDisconnect': {
					const clientId = action.payload.clientId;
					const existing = children.get(clientId);
					if (existing) {
						yield* killChild(existing);
						children.delete(clientId);
					} else {
						console.warn('Unknown client id: ' + clientId + ' for action: ', action);
					}
					break;
				}
				default:
					return assertNever(action);
			}
		}
	} finally {
		for (const child of children.values()) {
			yield* killChild(child);
		}
	}
}
