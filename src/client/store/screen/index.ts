import buildReducer from "../../../common/utils/buildReducer";
import { initialState } from "./state";
import * as mainActions from '../actions';
import doMutation from "../../../common/utils/doMutation";

export default buildReducer(initialState, mainActions, {
	accountCreation(state) {
		return doMutation(state).set('currentScreen', 'account');
	},
	connectionLost(state, { payload }) {
		return doMutation(state).batch(
			s => s.set('currentError', payload),
			s => s.set('loading', false),
		);
	},
	joinedMeeting(state) {
		return doMutation(state).batch(
			s => s.set('currentScreen', 'meeting'),
			s => s.set('loading', true),
		);
	},
	joinedMeetingSuccess(state) {
		return doMutation(state).set('loading', false);
	},
	endCall(state) {
		return doMutation(state).set('loading', false);
	},
});
