import { combineReducers } from 'redux';
import todosReducer from './todosReducer';
import authReducer from './authReducer';
import themeReducer from './themeReducer';

export default combineReducers({
  todos: todosReducer,
  auth: authReducer,
  theme: themeReducer,
});
