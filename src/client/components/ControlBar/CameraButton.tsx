import React, { FC } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import SvgIcon from '@material-ui/core/SvgIcon';
import {getLocalCameraStream} from '../../store/selectors';
import Button, {ButtonColor} from '../Button';
import {requestCamera} from '../../store/actions';

type State = 'enabled' | 'disabled';
const iconMap: Record<State, typeof SvgIcon> = {
	enabled: VideocamIcon,
	disabled: VideocamOffIcon,
}
const colorMap: Record<State, ButtonColor> = {
	enabled: 'green',
	disabled: 'red',
}

function toState(hasStream: boolean): State {
	if (hasStream) {
		return 'enabled';
	}
	return 'disabled';
}

const CameraButton: FC = (): JSX.Element => {
	const dispatch = useDispatch();
	const hasStream = !!useSelector(getLocalCameraStream);
	const state = toState(hasStream);
	return (
		<Button icon={iconMap[state]} color={colorMap[state]} onClick={() => {
			dispatch(requestCamera(!hasStream));
		}}/>
	);
}

export default CameraButton;
