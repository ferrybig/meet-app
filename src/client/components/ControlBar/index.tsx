import React, { FC, memo } from 'react';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Button from '../Button';
import MicButton from './MicButton';
import CameraButton from './CameraButton';
import EndCallButton from './EndCallButton';
import PictureInPictureButton from './PictureInPictureButton';
import classes from './index.module.css';

const ControlBar: FC = (): JSX.Element => {

	return (
		<div className={classes.root}>
			<div className={classes.left}>
			</div>
			<div className={classes.center}>
				<MicButton/>
				<CameraButton/>
				<EndCallButton/>
			</div>
			<div className={classes.right}>
				<PictureInPictureButton/>
				<Button icon={FullscreenIcon}/>
			</div>
		</div>
	);
}

export default memo(ControlBar);
