export interface DisconnectPacket {
	type: 'disconnect',
	reason: string,
}

export interface VersionPacket {
	type: 'version',
	version: string,
}
export interface PingPacket {
	type: 'ping',
	data: number,
}
export interface PongPacket {
	type: 'pong',
	data: number,
}
export interface PreAuthPacket {
	type: 'pre-auth',
	challenge: string,
}
export interface PreAuthResponsePacket {
	type: 'pre-auth-response',
	response: string,
	name: string,
	publicKey: string,
}
export interface AuthorizedPacket {
	type: 'authorized',
	initialClients: string[],
	iceServers: RTCIceServer[],
}
export interface ClientJoinedPacket {
	type: 'client-join',
	clientId: string,
	name: string,
	shouldOfferSDP: boolean,
}
export interface ClientDisconnectedPacket {
	type: 'client-disconnect',
	clientId: string,
}
export interface ClientIceUpdatePacket {
	type: 'client-ice',
	clientId: string,
	ice: RTCIceCandidateInit[],
}
export interface ClientSdpUpdatePacket {
	type: 'client-sdp',
	clientId: string,
	sdp: RTCSessionDescriptionInit;
	isOffer: boolean,
}
export interface ClientHealthPacket {
	type: 'client-health',
	clientId: string,
	connections: number,
	packetLoss: number,
}

export type InitialServerToClient = PreAuthPacket | DisconnectPacket | AuthorizedPacket;
export type InitialClientToServer = VersionPacket | PreAuthResponsePacket;
export type ConnectedServerToClient = PingPacket | ClientIceUpdatePacket | ClientSdpUpdatePacket | ClientJoinedPacket | ClientDisconnectedPacket | DisconnectPacket;
export type ConnectedClientToServer = PongPacket | ClientIceUpdatePacket | ClientSdpUpdatePacket;
