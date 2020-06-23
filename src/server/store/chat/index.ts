import buildReducer from "../../../common/utils/buildReducer";
import { initialState } from "./state";
import * as mainActions from '../actions';
import doMutation from "../../../common/utils/doMutation";

export default buildReducer(initialState, mainActions, {
	clientDisconnect(state, { payload }) {
		const room = state.rooms[payload.roomId];
		if(!room) {
			return state;
		}
		const index = room.people.indexOf(payload.clientId);
		if(index < 0) {
			return state;
		}
		const people = [...room.people];
		people.splice(index, 1);
		const roomClone = {
			...state.rooms,
		};
		if (people.length === 0) {
			delete roomClone[payload.roomId];
		} else {
			roomClone[payload.roomId] = {
				...room,
				people,
			};
		}
		return {
			...state,
			rooms: roomClone,
		};
	},
	clientJoin(state, { payload }) {
		const room = state.rooms[payload.roomId];
		if (!room) {
			return doMutation(state)('rooms').set(payload.roomId, {
				roomId: payload.roomId,
				people: [payload.clientId],
			});
		}
		return {
			...state,
			rooms: {
				...state.rooms,
				[payload.roomId]: {
					...room,
					people: [...room.people, payload.clientId],
				}
			}
		};
	},
});
