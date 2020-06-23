import React, { FC } from 'react';
import classes from './Meeting.module.css';
import PeopleRenderer from '../components/PeopleRenderer';

const Meeting: FC = (): JSX.Element => {

	return (
		<PeopleRenderer/>
	);
}

export default Meeting;
