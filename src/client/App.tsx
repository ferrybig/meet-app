import React, { FC, useEffect } from 'react';
import classes from './App.module.css';
import {useSelector} from 'react-redux';
import {getScreenStateScreen, getScreenStateError} from './store/selectors';
import assertNever from '../common/utils/assertNever';
import Account from './pages/Account';
import Meeting from './pages/Meeting';
import Initial from './pages/Initial';

const App: FC = (): JSX.Element => {
	const screenType = useSelector(getScreenStateScreen);
	const error = useSelector(getScreenStateError);
	useEffect(() => {
		document.body.classList.add(classes.body);
		document.body.parentElement!.classList.add(classes.html);
		const root = document.getElementById('root')!;
		root.classList.add(classes.root);
		return () => {
			document.body.classList.remove(classes.body);
			document.body.parentElement!.classList.remove(classes.html);
			root.classList.remove(classes.root);
		}
	}, []);

	let main: JSX.Element;
	switch(screenType) {
		case 'account':
			main = <Account/>;
			break;
		case 'meeting':
			main = <Meeting/>;
			break;
		case 'initial':
			main = <Initial/>;
			break;
		default:
			main = assertNever(screenType);
	}
	return <>
		{main}
		{error && <div/>}
	</>;
}

export default App;
