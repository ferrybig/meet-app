import buildReducer from "../../../common/utils/buildReducer";
import { initialState } from "./state";
import * as mainActions from '../actions';
import doMutation from "../../../common/utils/doMutation";

export default buildReducer(initialState, mainActions, {
	clientDisconnect(state, { payload }) {
		return doMutation(state)('connections').delete(payload.clientId);
	},
	clientJoin(state, { payload }) {
		return doMutation(state)('connections').set(payload.clientId, {
			clientId: payload.clientId,
			name: payload.name,
			roomId: payload.roomId,
		});
	},
});
