import { put, call, fork } from 'redux-saga/effects'
import {accountReady, accountCreation, unpersist} from "../store/actions";
import persistSaga from './persist';
import openConnection from './connection';
import {take} from '../../common/utils/effects';
import streamControlHandler from './streamControl';
import virtualMicHandler from './virtualMic';
import hardwareRequestHandler from './hardwareRequest';

function* mainSaga() {
	yield put(accountCreation());
	const action: ReturnType<typeof accountReady> = yield take(accountReady);
	const result = yield call(openConnection, action.payload);
	console.log('Meeting ended!', result);
}

export default function* indexSaga() {
	yield fork(persistSaga);
	yield fork(streamControlHandler);
	yield fork(virtualMicHandler);
	yield fork(hardwareRequestHandler);
	// Wait for the unpersist to finish before starting the app
	yield take(unpersist);
	yield fork(mainSaga);
}