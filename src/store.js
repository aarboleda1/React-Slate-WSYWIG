import { createStore } from 'redux';
import rootReducer from  './reducers/reducers.js';
export default(initialState) => {
    return createStore(rootReducer, initialState);
}