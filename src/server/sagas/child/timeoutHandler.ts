import NodeWebSocket from 'ws';
import {SagaIterator, eventChannel, END} from 'redux-saga';
import onEvent from '../../../common/utils/onEvent';
import {take} from '../../../common/utils/effects';
import {put} from 'redux-saga/effects';
import assertNever from '../../../common/utils/assertNever';
import {clientPing} from '../../store/actions';
export default function* (webSocket: NodeWebSocket, clientId: string): SagaIterator<never> {
	const channel = eventChannel<'ping' | 'timeout'>(emitter => {
		let tick = 2;
		const intervalId = setInterval(() => {
			tick--;
			if (tick == 0) {
				emitter('ping');
			} else if (tick < 0) {
				emitter('timeout');
			}
		}, 30000);
		return onEvent(webSocket, {
			close() {
				emitter(END);
			},
			message() {
				tick = 2;
			},
		}, () => {
			clearInterval(intervalId);
		});
	});

	while (true) {
		const packet: 'ping' | 'timeout' = yield take(channel);
		switch (packet) {
			case 'ping':
				yield put(clientPing(clientId));
				break;
			case 'timeout':
				throw new Error('Client ' + clientId + ' timed out');
			default:
				return assertNever(packet);
		}
	}
}
