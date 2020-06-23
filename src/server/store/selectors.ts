import { State } from './reducer';
import {keySelector} from '../../common/utils/keySelector';
import chat from './chat/selectors';
import connections from './connections/selectors';

const stateSelector = keySelector<State>();

export const getChatState = stateSelector('chat');
export const getChatPeopleInRoom = getChatState.connect(chat.getPeopleInRoom);

export const getConnectionState = stateSelector('connections');
export const getPersonOrNull = getConnectionState.connect(connections.getOrNull);
