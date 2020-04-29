const initState = {
  loginForm: true,
  user: null,
  loading: true,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN':
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
      return {
        ...state,
        user: null,
      };
    case 'ONLOAD_LOGIN':
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
    case 'SWITCH_AUTH_FORM':
      return {
        ...state,
        loginForm: !state.loginForm,
      };
    default:
      return state;
  }
};

export default authReducer;
