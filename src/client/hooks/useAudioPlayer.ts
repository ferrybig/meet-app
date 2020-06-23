import {useLayoutEffect, useState} from "react";

export default function useAudioPlayer(stream: MediaStream | null, muted: boolean = false): AnalyserNode | null {
	const [audioCtxState, setAudioCtxState] = useState<[AudioContext, AnalyserNode] | null>(null);
	useLayoutEffect(() => {
		const audioCtx = new AudioContext({
			latencyHint: 'interactive',
		});
		const analyser = audioCtx.createAnalyser();
		analyser.fftSize = 128;
		analyser.smoothingTimeConstant = 0;
		analyser.minDecibels = -90;
		analyser.maxDecibels = -10;
		if (!muted) {
			analyser.connect(audioCtx.destination);
			audioCtx.resume();
		}
		setAudioCtxState([audioCtx, analyser]);
		return () => {
			audioCtx.close();
		};
	}, [muted]);
	useLayoutEffect(() => {
		if (audioCtxState && stream) {
			const [audioCtx, analyser] = audioCtxState;
			const source = audioCtx.createMediaStreamSource(stream);
			source.connect(analyser);
			return () => source.disconnect(analyser);
		}
	}, [audioCtxState, stream]);
	return audioCtxState ? audioCtxState[1] : null;
};
