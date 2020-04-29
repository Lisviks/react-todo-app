const initState = {
  todos: [],
  // Pagination
  currentTodos: [],
  currentPage: 1,
  pageLimit: 5,
  // Filter
  filter: 'all',
  filteredTodos: [],
  // Loader
  loading: false,
};

const todosReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_TODOS':
      return {
        ...state,
        todos: action.payload.todos,
        currentTodos: action.payload.currentTodos,
        filteredTodos: action.payload.todos,
        loading: action.payload.loading,
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [action.payload.todo, ...state.todos],
        currentTodos: action.payload.currentTodos,
        filteredTodos: action.payload.filteredTodos,
      };
    case 'EDIT_TODO':
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
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.payload.todoId) {
            todo.complete = action.payload.complete;
          }
          return todo;
        }),
        currentTodos: action.payload.currentTodos,
        filteredTodos: action.payload.filteredTodos,
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.todoId),
        currentTodos: action.payload.currentTodos,
        filteredTodos: action.payload.filteredTodos,
      };
    case 'NEXT_PAGE':
      return {
        ...state,
        currentTodos: action.payload.currentTodos,
        currentPage: action.payload.currentPage,
      };
    case 'PREV_PAGE':
      return {
        ...state,
        currentTodos: action.payload.currentTodos,
        currentPage: action.payload.currentPage,
      };
    case 'FILTER':
      return {
        ...state,
        filter: action.payload.filter,
        filteredTodos: action.payload.filteredTodos,
        currentTodos: action.payload.currentTodos,
        currentPage: 1,
      };
    case 'SET_PAGE_LIMIT':
      return {
        ...state,
        pageLimit: action.payload,
      };
    case 'UPDATE_CURRENT_TODOS':
      return {
        ...state,
        currentTodos: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      };
    default:
      return state;
  }
};

export default todosReducer;
