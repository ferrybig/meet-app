import React, { FC, memo } from 'react';
import PictureInPictureIcon from '@material-ui/icons/PictureInPictureAlt';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Button from '../Button';
import classes from './index.module.css';
import MicButton from './MicButton';
import CameraButton from './CameraButton';
import EndCallButton from './EndCallButton';

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
				<Button icon={PictureInPictureIcon}/>
				<Button icon={FullscreenIcon}/>
			</div>
		</div>
	);
}

export default memo(ControlBar);
