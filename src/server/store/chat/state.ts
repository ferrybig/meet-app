import {Room} from "../types";

export default interface ChatState {
	rooms: Partial<Record<Room['roomId'], Room>>,
}

export const initialState: Readonly<ChatState> = {
	rooms: {},
}
