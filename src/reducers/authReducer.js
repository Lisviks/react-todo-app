const authReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      console.log(action);
      return {
        ...state,
        user: {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
        },
      };
    case 'SIGN_UP':
      console.log(action);
      return {
        ...state,
        user: {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
        },
      };
    case 'LOGOUT':
      console.log(action);
      return {
        ...state,
        user: null,
      };
    case 'ONLOAD_LOGIN':
      console.log(action);
      return {
        ...state,
        user: {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
        },
      };
    default:
      return state;
  }
};

export default authReducer;
