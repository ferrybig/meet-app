import React, { FC, useEffect, useRef } from 'react';

interface Props {
	width?: number,
	height?: number,
	stream: MediaStream | null,
}

const VideoFrame: FC<Props> = ({
	width,
	height,
	stream,
}): JSX.Element => {
	const videoRef = useRef<HTMLVideoElement>(null);
	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.srcObject = stream;
			if (stream) {
				videoRef.current.play();
			}
		}
	}, [stream]);

	return (
		<video
			width={width}
			height={height}
			ref={videoRef}
			disablePictureInPicture
			autoPlay
			tabIndex={-1}
		/>
	);
}

export default VideoFrame;
