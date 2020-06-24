import {pictureInPictureEnable, pictureInPictureDisable, endCall} from "../store/actions";
import {take} from "../../common/utils/effects";
import {fork, cancel} from "redux-saga/effects";
import {Task} from "redux-saga";

function pictureInPictureEventHandler() {

}

export default function* pictureInPictureHandler() {
	if ('pictureInPictureEnabled' in document) {
		while (true) {
			yield take(pictureInPictureEnable);
			const task: Task = yield fork(pictureInPictureEventHandler);
			yield take([pictureInPictureDisable, endCall]);
			yield cancel(task);
		}
	}
}