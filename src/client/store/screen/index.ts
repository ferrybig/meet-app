import buildReducer from "../../../common/utils/buildReducer";
import { initialState } from "./state";
import * as mainActions from '../actions';
import doMutation from "../../../common/utils/doMutation";

export default buildReducer(initialState, mainActions, {
	accountCreation(state) {
		return doMutation(state).set('currentScreen', 'account');
	},
	connectionLost(state, { payload }) {
		return doMutation(state).set('currentError', payload);
	},
	joinedMeeting(state) {
		return doMutation(state).set('currentScreen', 'meeting');
	},
});
