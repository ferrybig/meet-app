import {put} from "redux-saga/effects";
import {unpersist, accountReady} from "../store/actions";
import {PersistState} from "../store/types";
import {take} from "../../common/utils/effects";

const STORAGE_KEY = 'meet-app';
const storage = window.localStorage;

export default function* persistSaga() {
	// Load localstorage
	const fromStorage = storage.getItem(STORAGE_KEY);
	let persistState: PersistState | undefined = fromStorage === null ? undefined : JSON.parse(fromStorage);
	yield put(unpersist(persistState));
	while (true) {
		const { payload }: ReturnType<typeof accountReady> = yield take(accountReady);
		const state: PersistState = {
			name: payload.name,
		};
		// Store payload
		storage.setItem(STORAGE_KEY, JSON.stringify(state));
	}
}