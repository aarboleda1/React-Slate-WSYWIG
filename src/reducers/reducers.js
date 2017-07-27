import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';

const initialState = {
	test: 'hello_world,'
}

export function update(state = initialState, action) {
  switch (action.type) {
    case action.type:
      return Object.assign({}, state, action.type);
    default:
      return state;
  }
}


export default combineReducers({
  update,
  //routing: routerReducer,
});
