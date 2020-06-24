import React, { FC } from 'react';
import classes from './AutoLoader.module.css';
import {useSelector} from 'react-redux';
import {isScreenLoading} from '../store/selectors';

const AutoLoader: FC = (): JSX.Element | null => {
	const isLoading = useSelector(isScreenLoading);
	if (!isLoading) {
		return null;
	}
	return (
		<div className={classes.root}>
			<div className={classes.title}>
				Connecting...
			</div>
			<svg className={classes.spinner} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle className={classes.spinnerCircle} cx="50" cy="50" r="45"/>
			</svg>
		</div>
	);
}

export default AutoLoader;
