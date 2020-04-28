const initState = {
  theme: 'light',
};

const themeReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload.theme,
      };
    default:
      return state;
  }
};

export default themeReducer;
