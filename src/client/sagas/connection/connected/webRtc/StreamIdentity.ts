export default class StreamIdentity {
	private stream: MediaStream[];
	private connection: RTCPeerConnection;
	private senders: RTCRtpSender[];

	public constructor(connection: RTCPeerConnection, stream: MediaStream[], trackedStream: MediaStream | null) {
		this.stream = stream;
		this.connection = connection;
		this.senders = [];
		this.update(trackedStream);
	}
	public update(trackedStream: MediaStream | null) {
		for (const sender of this.senders) {
			this.connection.removeTrack(sender);
		}
		this.senders.length = 0;
		if(trackedStream) {
			for (const track of trackedStream.getTracks()) {
				this.senders.push(this.connection.addTrack(track, ...this.stream));
			}
		}
	}
}
