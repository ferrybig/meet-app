import {combineReducers} from "redux";
import chat from './chat';
import connections from './connections';

const reducer = combineReducers({
	chat,
	connections,
});

export type State = ReturnType<typeof reducer>;
export default reducer;
