import React, { FC } from 'react';
import PeopleRenderer from '../components/PeopleRenderer';
import AutoLoader from '../components/AutoLoader';
import ErrorDialog from '../components/ErrorDialog';

const Meeting: FC = (): JSX.Element => {

	return (
		<>
			<PeopleRenderer/>
			<AutoLoader/>
			<ErrorDialog/>
		</>
	);
}

export default Meeting;
