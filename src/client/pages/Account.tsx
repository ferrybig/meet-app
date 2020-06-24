import React, {FC, useLayoutEffect, useCallback} from 'react';
import classes from './Account.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {accountReady, requestCamera, requestMicrophone} from '../store/actions';
import Center from '../components/Center';
import OwnVideoFrame from '../components/OwnVideoFrame';
import Button from '../components/Button';
import {State} from '../store/reducer';
import {AnyAction} from 'redux';
import {getLocalCameraStream, getLocalName, getLocalMicrophoneStream} from '../store/selectors';
import useReduxBasedLocalState from '../hooks/useReduxBasedLocalState';

const [ButtonCamera, ButtonMicrophone] = (() => {
	const ButtonFactory = (
		selector: (state: State) => MediaStream | null,
		name: string,
		actionCreator: (shouldRequest: boolean) => AnyAction,
	) => function ConstructedButton() {
		const dispatch = useDispatch();
		const stream = useSelector((state: State) => !!selector(state));
		const setup = useCallback(() => {
			dispatch(actionCreator(true));
		}, [dispatch]);

		useLayoutEffect(() => {
			setup();
		}, [setup]);

		return stream ? (
			<p>All set and operating normally!</p>
		) : (
			<Button onClick={setup}>{'Enable '+ name}</Button>
		)
	}
	return [
		ButtonFactory(getLocalCameraStream, 'camera', requestCamera),
		ButtonFactory(getLocalMicrophoneStream, 'microphone', requestMicrophone),
	];
})();

const Account: FC = (): JSX.Element => {
	const [name, setName] = useReduxBasedLocalState(getLocalName);
	const dispatch = useDispatch();
	const ready = () => {
		dispatch(accountReady({
			name,
			expires: 0,
			privateKey: '',
			publicKey: 'string',
			isValid: false,
		}));
	};

	return (
		<Center className={classes.center}>
			<div className={classes.sectionTop}>
			</div>
			<div className={classes.sectionLeft}>
				<OwnVideoFrame
					width={600}
					height={400}
				/>
			</div>
			<div className={classes.sectionRight}>
				<h2 className={classes.header}>1. Setup your name</h2>
				<input className={classes.input} value={name} onChange={e => setName(e.target.value)}/>
				<h2 className={classes.header}>2. Setup microphone</h2>
				<ButtonMicrophone/>
				<h2 className={classes.header}>3. Setup camera</h2>
				<ButtonCamera/>
				<h2 className={classes.header}>4. Ready</h2>
				<Button onClick={ready}>Join the meeting</Button>
			</div>
		</Center>
	);
}

export default Account;
