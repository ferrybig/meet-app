import React, { FC } from 'react';
import classes from './Center.module.css';

interface Props {
	className?: string,
}

const Center: FC<Props> = ({ children, className = '' }): JSX.Element => {
	return (
		<div className={`${classes.root} ${className}`}>
			{ children }
		</div>
	);
}

export default Center;
