const initState = {
  user: null,
  loading: true,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN':
      console.log(action);
      return {
        ...state,
        user: {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
          loading: false,
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
        loading: false,
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
        user: action.payload.user,
        loading: false,
      };
    case 'SET_AUTH_LOADING':
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default authReducer;
