import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension';
import * as actionCreators from './actions';
import mainSaga from '../sagas/';
import reducer from './reducer';

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
	actionCreators,
	trace: true,
	serialize: true,
});

const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware];

const store = createStore(reducer, composeEnhancers(
	applyMiddleware(...middleware),
));

sagaMiddleware.run(mainSaga);

export default store;