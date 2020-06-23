import {clientIncomingIce, clientIncomingSdp, attachVirtualMicrophone, attachCamera, attachPresentation, clientOutgoingSdp} from "../../../../store/actions";
import iceHandler from "./ice";
import {fork, actionChannel, select, put, apply} from "redux-saga/effects";
import {Channel} from "redux-saga";
import {AnyAction} from "redux";
import {getLocalVirtualMicrophoneStream, getLocalCameraStream, getLocalPresentationStream, getConnectionIceServers, getLocalMicrophoneStream} from "../../../../store/selectors";
import StreamIdentity from "./StreamIdentity";
import {take} from "../../../../../common/utils/effects";
import assertNever from "../../../../../common/utils/assertNever";
import trackHandler from "./trackHandler";
import negotiationHandler from "./negotiation";
import clientHealthHandler from "./clientHealth";

const EVENTS_CHILD = [
	clientIncomingIce,
	clientIncomingSdp,
	attachVirtualMicrophone,
	attachCamera,
	attachPresentation,
]
type EVENTS_CHILD = ReturnType<typeof EVENTS_CHILD[number]>;

export default function* childHandler(clientId: string, shouldOffer: boolean) {
	const iceServers: ReturnType<typeof getConnectionIceServers> = yield select(getConnectionIceServers);
	const connection = new RTCPeerConnection({
		iceServers,
	});
	try {
		yield fork(clientHealthHandler, connection, clientId);
		yield fork(iceHandler, connection, clientId);
		yield fork(trackHandler, connection, clientId);
		yield fork(negotiationHandler, connection, clientId, shouldOffer);


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
				if (!action.payload || !('clientId' in action.payload)) {
					return true;
				}
				const actionValue = action.payload['clientId'];
				return Object.is(actionValue, clientId);
			});
		})();

		const mainStream = new MediaStream();
		const auxStream = new MediaStream();

		const micStream = new StreamIdentity(connection, [mainStream], yield select(getLocalVirtualMicrophoneStream));
		const camaraStream = new StreamIdentity(connection, [mainStream], yield select(getLocalCameraStream));
		const presentationStream = new StreamIdentity(connection, [mainStream, auxStream], yield select(getLocalPresentationStream));

		while (true) {
			const action: EVENTS_CHILD = yield take(channel);
			switch(action.type) {
				case 'clientIncomingIce':
					for (const candidate of action.payload.ice) {
						if (candidate) {
							yield apply(connection, connection.addIceCandidate, [candidate]);
						}
					}
					break;
				case 'clientIncomingSdp':
					connection.setRemoteDescription(action.payload.sdp);
					if (action.payload.isOffer) {
						const sdp = yield apply(connection, connection.createAnswer, []);
						connection.setLocalDescription(sdp);
						yield put(clientOutgoingSdp(clientId, sdp, false));
					}
					break;
				case 'attachVirtualMicrophone':
					micStream.update(action.payload);
					break;
				case 'attachCamera':
					camaraStream.update(action.payload);
					break;
				case 'attachPresentation':
					presentationStream.update(action.payload);
					break;
				default:
					return assertNever(action);

			}
		}
	} finally {
		connection.close();
	}
}