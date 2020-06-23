import buildReducer from "../../../common/utils/buildReducer";
import {initialState} from "./state";
import * as mainActions from '../actions';
import doMutation from "../../../common/utils/doMutation";

export default buildReducer(initialState, mainActions, {
	unpersist(state, {payload}) {
		return payload ? doMutation(state)('account').set('name', payload.name) : state;
	},
	attachVirtualMicrophone(state, {payload}) {
		return doMutation(state)('streams').set('virtualMicrophone', payload);
	},
	attachMicrophone(state, {payload}) {
		return doMutation(state).batch(
			s => s('streams').set('microphone', payload),
			s => s.set('muted', false),
		);
	},
	attachCamera(state, {payload}) {
		return doMutation(state)('streams').set('camera', payload);
	},
	attachPresentation(state, {payload}) {
		return doMutation(state)('streams').set('presentation', payload);
	},
	accountReady(state, {payload}) {
		return doMutation(state).set('account', payload)
	},
	muteMicrophone(state, {payload}) {
		return doMutation(state).set('muted', payload)
	},
});