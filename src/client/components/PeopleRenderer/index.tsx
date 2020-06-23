import React, { FC } from 'react';
import classes from './index.module.css';
import useSizeCapture from '../../hooks/useSizeCapture';
import useRenderEngine from '../../hooks/useRenderEngine';
import {getPeopleKnownIdsWithSelf} from '../../store/selectors';
import {useSelector} from 'react-redux';
import Person from './Person';
import ControlBar from '../ControlBar';



const PeopleRenderer: FC = (): JSX.Element => {
	const [ref, width, height] = useSizeCapture();
	const people = useSelector(getPeopleKnownIdsWithSelf);
	const children = useRenderEngine(people, width, height - 60, 0, 0, (person, position) => (
		<Person person={person} position={position} key={person || 1}/>
	));

	return (
		<div className={classes.root} ref={ref}>
			{children}
			<ControlBar/>
		</div>
	);
}

export default PeopleRenderer;
