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
    default:
      return state;
  }
};

export default authReducer;
