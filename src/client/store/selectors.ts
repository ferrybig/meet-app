import { State } from './reducer';
import {keySelector} from '../../common/utils/keySelector';
import {People} from './types';
import local from './local/selectors';
import connection from './connection/selectors';
import screen from './screen/selectors';
import people from './people/selectors';

const stateSelector = keySelector<State>();

export const getLocalState = stateSelector('local');
export const getLocalVirtualMicrophoneStream = getLocalState.connect(local.getVirtualMicrophoneStream);
export const getLocalMicrophoneStream = getLocalState.connect(local.getMicrophoneStream);
export const getLocalCameraStream = getLocalState.connect(local.getCamaraStream);
export const getLocalPresentationStream = getLocalState.connect(local.getPresentationStream);
export const getLocalName = getLocalState.connect(local.getName);
export const getLocalAsPerson = getLocalState.connect(local.getAsPerson);
export const getLocalMutedState = getLocalState.connect(local.getMutedState);

export const getConnectionState = stateSelector('connection');
export const getConnectionIceServers = getConnectionState.connect(connection.getIceServers);

export const getScreenState = stateSelector('screen');
export const getScreenStateScreen = getScreenState.connect(screen.getCurrentScreen);
export const getScreenStateError = getScreenState.connect(screen.getError);

export const getPeopleState = stateSelector('people');
export const getPeopleKnownIds = getPeopleState.connect(people.getKnownIds);
export const getPeopleKnownIdsWithSelf = getPeopleState.connect(people.getKnownIdsWithSelf);
export const getPeopleById = getPeopleState.connect(people.getById);

export const getPeopleByIdOrSelf = (state: Pick<State, 'local' | 'people'>, id: string | null): People => (
	id === null ? getLocalAsPerson(state) : getPeopleById(state, id)
);
