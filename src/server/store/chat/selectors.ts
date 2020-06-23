import ChatState from "./state";

const EMPTY_PEOPLE_LIST: string[] = [];

export default {
	getPeopleInRoom(state: ChatState, roomId: string) {
		return state.rooms[roomId]?.people || EMPTY_PEOPLE_LIST;
	}
}
