import ScreenState from "./state";

export default {
	getCurrentScreen(state: ScreenState) {
		return state.currentScreen;
	},
	getError(state: ScreenState) {
		return state.currentError;
	},
	isLoading(state: ScreenState) {
		return state.loading;
	},
}
