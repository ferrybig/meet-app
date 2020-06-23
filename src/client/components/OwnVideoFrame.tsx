import React, { FC, memo } from 'react';
import VideoFrame from './VideoFrame';
import {useSelector} from 'react-redux';
import {getLocalCameraStream} from '../store/selectors';

interface Props {
	width?: number,
	height?: number,
}

const OwnVideoFrame: FC<Props> = ({
	width,
	height,
}): JSX.Element => {
	const stream = useSelector(getLocalCameraStream);
	return (
		<VideoFrame
			width={width}
			height={height}
			stream={stream}
		/>
	);
}

export default memo(OwnVideoFrame);
