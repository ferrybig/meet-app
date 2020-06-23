import {Connection} from "../types";

export default interface ConnectionState {
	connections: Partial<Record<Connection['roomId'], Connection>>,
}

export const initialState: Readonly<ConnectionState> = {
	connections: {},
}
