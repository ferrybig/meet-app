export default interface ConnectionState {
	iceServers: RTCIceServer[],
}

export const initialState: Readonly<ConnectionState> = {
	iceServers: RTCPeerConnection.getDefaultIceServers ? RTCPeerConnection.getDefaultIceServers() : [],
}
