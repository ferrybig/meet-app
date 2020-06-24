import {ScreenType} from "../types";

export default interface ScreenState {
	currentScreen: ScreenType,
	currentError: string | null;
	loading: boolean;
}

export const initialState: Readonly<ScreenState> = {
	currentScreen: 'initial',
	currentError: null,
	loading: false,
}
