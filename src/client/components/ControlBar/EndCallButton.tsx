import React, { FC } from 'react';
import {useDispatch} from 'react-redux';
import CallEndIcon from '@material-ui/icons/CallEnd';
import Button from '../Button';
import {endCall} from '../../store/actions';

const EndCallButton: FC = (): JSX.Element => {
	const dispatch = useDispatch();
	return (
		<Button icon={CallEndIcon} color="normal" onClick={() => {
			dispatch(endCall());
		}}/>
	);
}

export default EndCallButton;
