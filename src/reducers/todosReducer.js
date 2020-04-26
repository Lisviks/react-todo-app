const todosReducer = (state = [], action) => {
  switch (action.type) {
    case 'LOAD_TODOS':
      console.log(action);
      return {
        ...state,
        todos: action.payload,
      };
    case 'ADD_TODO':
      console.log(action);
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    default:
      return state;
  }
};

export default todosReducer;
