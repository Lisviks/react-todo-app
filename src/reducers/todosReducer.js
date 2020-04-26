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
    case 'EDIT_TODO':
      console.log(action);
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.payload.todoId) {
            todo.text = action.payload.text;
          }
          return todo;
        }),
      };
    case 'COMPLETE_TODO':
      console.log(action);
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.payload) {
            todo.complete = !todo.complete;
          }
          return todo;
        }),
      };
    case 'DELETE_TODO':
      console.log(action);
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    default:
      return state;
  }
};

export default todosReducer;
