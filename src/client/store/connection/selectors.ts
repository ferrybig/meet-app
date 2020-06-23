import ConnectionState from "./state";

export default {
	getIceServers(state: ConnectionState) {
		return state.iceServers;
	},
}
