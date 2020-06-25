import NodeWebSocket from "ws";
import action from "../../common/utils/ActionCreator";

export const newConnection = action('newConnection', (webSocket: NodeWebSocket, roomId: string, ip: string) => ({ webSocket, roomId, ip }));
export const clientJoin = action('clientJoin', (roomId: string, clientId: string, name: string) => ({ roomId, clientId, name }));
export const clientOutgoingSdp = action('clientOutgoingSdp', (sourceClientId: string, clientId: string, sdp: RTCSessionDescriptionInit, isOffer: boolean) => ({ sourceClientId, clientId, sdp, isOffer }));
export const clientRequestSdp = action('clientRequestSdp', (sourceClientId: string, clientId: string) => ({ sourceClientId, clientId }));
export const clientOutgoingIce = action('clientOutgoingIce', (sourceClientId: string, clientId: string, ice: RTCIceCandidateInit[]) => ({ sourceClientId, clientId, ice }));
export const clientDisconnect = action('clientDisconnect', (roomId: string, clientId: string) => ({ roomId, clientId }));
export const clientPing = action('clientPing', (clientId: string) => ({ clientId }));