import { combineReducers } from 'redux';
import todosReducer from './todosReducer';
import authReducer from './authReducer';

export default combineReducers({
  todos: todosReducer,
  auth: authReducer,
});
