import action from "../../common/utils/ActionCreator";
import {PersistState, Account, MediaInfo, ClientHealth} from "./types";

export const unpersist = action('unpersist', (state?: PersistState) => state);
export const accountCreation = action('accountCreation', () => null);
export const accountReady = action('accountReady', (account: Account) => account);
export const connectionLost = action('connectionLost', (cause: string) => cause);
export const endCall = action('endCall', () => null);

export const updateIceServers = action('updateIceServers', (iceServers: RTCIceServer[]) => iceServers)

export const requestCamera = action('requestCamera', (doAccuire: boolean = true) => doAccuire);
export const requestMicrophone = action('requestMicrophone', (doAccuire: boolean = true) => doAccuire);
export const requestScreenShare = action('requestScreenShare', (doAccuire: boolean = true) => doAccuire);

export const attachVirtualMicrophone = action('attachVirtualMicrophone', (stream: MediaStream | null) => stream);
export const attachMicrophone = action('attachMicrophone', (stream: MediaStream | null) => stream);
export const attachCamera = action('attachCamera', (stream: MediaStream | null) => stream);
export const attachPresentation = action('attachPresentation', (stream: MediaStream | null) => stream);

export const muteMicrophone = action('muteMicrophone', (muted: boolean) => muted);
export const pictureInPictureEnable = action('pictureInPictureEnable', () => null);
export const pictureInPictureDisable = action('pictureInPictureDisable', () => null);

export const joinedMeeting = action('joinedMeeting', () => null);
export const joinedMeetingSuccess = action('joinedMeetingSuccess', (clientIdList: string[], iceServers: RTCIceServer[]) => ({ clientIdList, iceServers }));

export const clientJoin = action('clientJoin', (clientId: string, name: string, shouldOffer: boolean) => ({ clientId, name, shouldOffer }));
export const clientIncomingSdp = action('clientIncomingSdp', (clientId: string, sdp: RTCSessionDescriptionInit, isOffer: boolean) => ({ clientId, sdp, isOffer }));
export const clientIncomingIce = action('clientIncomingIce', (clientId: string, ice: RTCIceCandidateInit[]) => ({ clientId, ice }));
export const clientOutgoingSdp = action('clientOutgoingSdp', (clientId: string, sdp: RTCSessionDescriptionInit, isOffer: boolean) => ({ clientId, sdp, isOffer }));
export const clientOutgoingIce = action('clientOutgoingIce', (clientId: string, ice: RTCIceCandidateInit[]) => ({ clientId, ice }));
export const clientRequestSdp = action('clientRequestSdp', (clientId: string) => ({ clientId }));
export const clientNegotiationNeeded = action('clientNegotiationNeeded', (clientId: string) => ({ clientId }));
export const clientDisconnect = action('clientDisconnect', (clientId: string) => ({ clientId }));
export const clientStreamAdded = action('clientStreamAdded', (clientId: string, mediaInfo: MediaInfo) => ({ clientId, mediaInfo }));
export const clientStreamRemoved = action('clientStreamRemoved', (clientId: string, mediaInfo: MediaInfo) => ({ clientId, mediaInfo }));

export const clientHealth = action('clientHealth', (clientId: string, health: ClientHealth) => ({ clientId, health }));
