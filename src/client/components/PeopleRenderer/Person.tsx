import React, { FC, memo, useMemo, useRef, useLayoutEffect } from 'react';
import classes from './Person.module.css';
import {ClientHealth} from '../../store/types';
import {useSelector} from 'react-redux';
import {getPeopleByIdOrSelf} from '../../store/selectors';
import {State} from '../../store/reducer';
import FlipDiv from '../FlipDiv';
import classNames from 'classnames';
import useAudioPlayer from '../../hooks/useAudioPlayer';
import SoundIndicator from '../SoundIndicator';

interface Props {
	person: string | null;
	position: {
		width: number,
		height: number,
		left: number,
		top: number,
	}
}
const bottomBarClasses: Record<ClientHealth, string> = {
	healty: classNames(classes.bottomBar, classes.bottomBarHealty),
	pending: classNames(classes.bottomBar, classes.bottomBarPending),
	disconnected: classNames(classes.bottomBar, classes.bottomBarDisconnected),
	error: classNames(classes.bottomBar, classes.bottomBarError),
};

function useArrayOfTracks(tracks: MediaStreamTrack[]): MediaStream | null {
	return useMemo(() => {
		if (tracks.length === 0) {
			return null;
		}
		const stream = new MediaStream();
		for (const track of tracks) {
			stream.addTrack(track);
		}
		return stream;
	}, [tracks]);
}

const Person: FC<Props> = ({
	person,
	position,
}): JSX.Element => {
	const actualPerson = useSelector((state: State) => getPeopleByIdOrSelf(state, person));

	const videoStream = useArrayOfTracks(actualPerson.cameraStream);
	const videoPlayer = useRef<HTMLVideoElement>(null);
	useLayoutEffect(() => {
		if (videoPlayer.current) {
			videoPlayer.current.srcObject = videoStream;
		}
	}, [videoStream, videoPlayer]);

	const audioStream = useArrayOfTracks(actualPerson.microphoneStream);
	const audioAnaliser = useAudioPlayer(audioStream, person === null ? true : false);
	return (
		<FlipDiv className={classes.root} position={position}>
			<video className={classes.video} ref={videoPlayer} controls={false} tabIndex={-1} disablePictureInPicture muted autoPlay/>
			<div className={bottomBarClasses[actualPerson.health]}>
				<div className={classes.bottomName}>{ actualPerson.name }</div>
				<SoundIndicator audio={audioAnaliser} width={50} height={'100%'}/>
			</div>
		</FlipDiv>
	);
};

export default memo(Person);
