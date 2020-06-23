import ConnectionState from "./state";

export default {
	getOrNull(state: ConnectionState, clientId: string) {
		return state.connections[clientId] || null;
	}
}
