import {People} from "../types";

export default interface PeopleState {
	entities: Record<string, People | undefined>,
}
export const initialState: Readonly<PeopleState> = {
	entities: {},
};
