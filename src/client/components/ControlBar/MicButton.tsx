import React, { FC } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import MicIcon from '@material-ui/icons/Mic';
import MicNoneIcon from '@material-ui/icons/MicNone';
import MicOffIcon from '@material-ui/icons/MicOff';
import SvgIcon from '@material-ui/core/SvgIcon';
import {getLocalMicrophoneStream, getLocalMutedState} from '../../store/selectors';
import Button, {ButtonColor} from '../Button';
import {muteMicrophone, requestMicrophone} from '../../store/actions';

type State = 'none' | 'enabled' | 'disabled';
const iconMap: Record<State, typeof SvgIcon> = {
	none: MicNoneIcon,
	enabled: MicIcon,
	disabled: MicOffIcon,
}
const colorMap: Record<State, ButtonColor> = {
	none: 'red',
	enabled: 'normal',
	disabled: 'red',
}

function toState(hasStream: boolean, isMuted: boolean): State {
	if (isMuted) {
		return 'disabled';
	}
	if (hasStream) {
		return 'enabled';
	}
	return 'none';
}

const MicButton: FC = (): JSX.Element => {
	const dispatch = useDispatch();
	const hasStream = !!useSelector(getLocalMicrophoneStream);
	const isMuted = useSelector(getLocalMutedState);
	const state = toState(hasStream, isMuted);
	return (
		<Button icon={iconMap[state]} color={colorMap[state]} onClick={() => {
			if(hasStream) {
				dispatch(muteMicrophone(!isMuted));
			} else {
				dispatch(requestMicrophone(true));
			}
		}}/>
	);
}

export default MicButton;
