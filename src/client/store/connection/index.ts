import buildReducer from "../../../common/utils/buildReducer";
import { initialState } from "./state";
import * as mainActions from '../actions';
import doMutation from "../../../common/utils/doMutation";

export default buildReducer(initialState, mainActions, {
	joinedMeetingSuccess(state, action) {
		return doMutation(state).set('iceServers', [...action.payload.iceServers, ...initialState.iceServers]);
	},
});