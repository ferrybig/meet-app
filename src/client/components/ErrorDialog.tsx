import React, { FC, ReactNode } from 'react';
import classes from './ErrorDialog.module.css';
import {useSelector} from 'react-redux';
import {getScreenStateError} from '../store/selectors';

function nl2br(input: string): ReactNode[] {
	const children: ReactNode[] = [];
	let key = 1;
	for (const part of input.split('\n')) {
		children.push(part);
		children.push(<br key={key++}/>);
	}
	if (children.length > 0) {
		children.length = children.length - 1;
	}
	return children;
}

const ErrorDialog: FC = (): JSX.Element | null => {
	const error = useSelector(getScreenStateError);
	if (!error) {
		return null;
	}
	return (
		<div className={classes.root}>
			<div className={classes.title}>
				There was an unexpected error!
			</div>
			<div className={classes.description}>
				{nl2br(`Technical details follows:\n\n${error}`)}
			</div>
		</div>
	);
}

export default ErrorDialog;
