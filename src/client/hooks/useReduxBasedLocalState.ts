import {State} from "../store/reducer";
import {useStore} from "react-redux";
import {useState} from "react";

export default function useReduxBasedLocalState<R>(selector: (state: State) => R): [R, (state: R | ((state: R) => R)) => void] {
	const store = useStore();
	return useState(() => selector(store.getState()));
}
