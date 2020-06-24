import React, { FC } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PictureInPictureAltIcon from '@material-ui/icons/PictureInPictureAlt';
import PictureInPictureIcon from '@material-ui/icons/PictureInPicture';
import Button from '../Button';
import {pictureInPictureEnable, pictureInPictureDisable} from '../../store/actions';
import {getLocalPictureInPictureEnabled} from '../../store/selectors';

const PictureInPictureButton: FC = (): JSX.Element | null => {
	const dispatch = useDispatch();
	const isEnabled = useSelector(getLocalPictureInPictureEnabled);
	if (!('pictureInPictureEnabled' in document)) {
		return null;
	}
	return (
		<Button icon={isEnabled ? PictureInPictureAltIcon : PictureInPictureIcon} color="normal" onClick={() => {
			if (isEnabled) {
				dispatch(pictureInPictureDisable());
			} else {
				dispatch(pictureInPictureEnable());
			}
		}}/>
	);
}

export default PictureInPictureButton;
