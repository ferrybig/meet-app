import {combineReducers} from "redux";
import local from './local';
import connection from './connection';
import screen from './screen';
import people from './people';

const reducer = combineReducers({
	local,
	connection,
	screen,
	people,
});

export type State = ReturnType<typeof reducer>;
export default reducer;
