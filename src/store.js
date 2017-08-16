import { createStore } from 'redux';
import rootReducer from  './reducers/reducers.js';
// const initialState = {test: '123'}
export default(initialState) => {
    return createStore(
			rootReducer, 
			initialState,
			window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
		);
}