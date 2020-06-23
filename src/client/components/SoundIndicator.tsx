import React, { FC, useState, useEffect } from 'react';
import classes from './SoundIndicator.module.css';

interface Props {
	audio: AnalyserNode | null;
	width: number | string;
	height: number | string;
}

const SoundIndicator: FC<Props> = ({
	audio,
	width,
	height,
}): JSX.Element => {
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
	useEffect(() => {
		if (canvas) {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		}
	}, [width, height, canvas]);
	useEffect(() => {
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				return;
			}
			ctx.fillStyle = '#eee';
			if(!audio) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				return;
			}
			const bufferLengthAlt = audio.frequencyBinCount;
			const dataArrayAlt = new Uint8Array(bufferLengthAlt);
			let taskId: number;
			const task = () => {
				taskId = window.requestAnimationFrame(task);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				audio.getByteFrequencyData(dataArrayAlt);
				for(var i = 0; i < bufferLengthAlt; i++) {
					const barHeight = dataArrayAlt[i] * canvas.height / 256;
					ctx.fillRect(
						i * canvas.width / bufferLengthAlt,
						(canvas.height - barHeight) / 2,
						canvas.width / bufferLengthAlt,
						barHeight
					);
				}
			}
			taskId = window.requestAnimationFrame(task);
			return () => window.cancelAnimationFrame(taskId);
		}
	}, [audio, canvas])

	return (
		<canvas style={{width, height}} ref={setCanvas}/>
	);
}

export default SoundIndicator;
