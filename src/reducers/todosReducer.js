const initState = {
  todos: [],
  // Pagination
  currentTodos: [],
  currentPage: 1,
  pageLimit: 5,
};

const todosReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_TODOS':
      console.log(action);
      return {
        ...state,
        todos: action.payload.todos,
        currentTodos: action.payload.currentTodos,
      };
    case 'ADD_TODO':
      console.log(action);
      return {
        ...state,
        todos: [action.payload, ...state.todos],
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
    case 'NEXT_PAGE':
      console.log(action);
      return {
        ...state,
        currentTodos: action.payload.currentTodos,
        currentPage: action.payload.currentPage,
      };
    case 'PREV_PAGE':
      console.log(action);
      return {
        ...state,
        currentTodos: action.payload.currentTodos,
        currentPage: action.payload.currentPage,
      };
    default:
      return state;
  }
};

export default todosReducer;
