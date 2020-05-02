import { firestore } from '../config/firebase';

const updateCurrentTodos = (dispatch, options) => {
  const { pageLimit } = options.state;
  if (!options.currentPage) options.currentPage = options.state.currentPage;
  const currentTodos = [...options.todos]
    .splice(options.currentPage * pageLimit - pageLimit)
    .splice(0, pageLimit);

  dispatch({ type: 'UPDATE_CURRENT_TODOS', payload: currentTodos });
};

const filterTodos = (dispatch, options) => {
  const filteredTodos = [...options.todos].filter((todo) => {
    if (options.filter === 'active') return !todo.complete;
    if (options.filter === 'complete') return todo.complete;
    return todo;
  });
  dispatch({ type: 'FILTER_TODOS', payload: filteredTodos });
  return filteredTodos;
};

export const loadTodos = (userId) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });
      const res = await firestore
        .collection('users')
        .doc(userId)
        .collection('todos')
        .orderBy('createdAt', 'desc')
        .get();

      const todos = res.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      filterTodos(dispatch, { todos });

      const state = getState();
      updateCurrentTodos(dispatch, { todos, state: state.todos });

      dispatch({
        type: 'LOAD_TODOS',
        payload: { todos, loading: false },
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const addTodo = (userId, text) => {
  return async (dispatch, getState) => {
    const state = getState();
    const newTodo = {
      text,
      complete: false,
      createdAt: Date.now(),
    };

    const res = await firestore
      .collection('users')
      .doc(userId)
      .collection('todos')
      .add({ ...newTodo });

    const todos = [{ ...newTodo, id: res.id }, ...state.todos.todos];

    const filteredTodos = filterTodos(dispatch, {
      filter: state.todos.filter,
      todos,
    });
    updateCurrentTodos(dispatch, {
      todos: filteredTodos,
      state: state.todos,
    });

    dispatch({
      type: 'ADD_TODO',
      payload: {
        todo: { ...newTodo, id: res.id },
      },
    });
  };
};

export const editTodo = (userId, todoId, text) => {
  return (dispatch) => {
    try {
      firestore
        .collection('users')
        .doc(userId)
        .collection('todos')
        .doc(todoId)
        .update({ text });

      dispatch({ type: 'EDIT_TODO', payload: { todoId, text } });
    } catch (err) {
      console.log(err);
    }
  };
};

export const completeTodo = (userId, todoId, complete) => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const todos = state.todos.todos.map((todo) => {
        if (todo.id === todoId) todo.complete = !todo.complete;
        return todo;
      });

      await firestore
        .collection('users')
        .doc(userId)
        .collection('todos')
        .doc(todoId)
        .update({ complete });

      const filteredTodos = filterTodos(dispatch, {
        filter: state.todos.filter,
        todos,
      });
      updateCurrentTodos(dispatch, {
        todos: filteredTodos,
        state: state.todos,
      });

      dispatch({
        type: 'COMPLETE_TODO',
        payload: { todoId, complete },
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteTodo = (userId, todoId) => {
  return (dispatch, getState) => {
    try {
      firestore
        .collection('users')
        .doc(userId)
        .collection('todos')
        .doc(todoId)
        .delete();

      const state = getState();
      const todos = state.todos.todos.filter((todo) => todo.id !== todoId);

      const filteredTodos = filterTodos(dispatch, {
        filter: state.todos.filter,
        todos,
      });
      updateCurrentTodos(dispatch, {
        todos: filteredTodos,
        state: state.todos,
      });

      dispatch({
        type: 'DELETE_TODO',
        payload: { todoId },
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const nextPage = () => {
  return (dispatch, getState) => {
    const state = getState();

    const { currentTodos, currentPage, pageLimit } = state.todos;

    if (currentTodos.length < pageLimit) return;

    const todos = [...state.todos.filteredTodos]
      .splice(currentPage * pageLimit)
      .splice(0, pageLimit);

    dispatch({
      type: 'NEXT_PAGE',
      payload: { currentTodos: todos, currentPage: currentPage + 1 },
    });
  };
};

export const prevPage = () => {
  return (dispatch, getState) => {
    const state = getState();

    const { currentPage, pageLimit } = state.todos;

    if (currentPage === 1) return;

    const todos = [...state.todos.filteredTodos]
      .splice(currentPage * pageLimit - pageLimit * 2)
      .splice(0, pageLimit);

    dispatch({
      type: 'PREV_PAGE',
      payload: { currentTodos: todos, currentPage: currentPage - 1 },
    });
  };
};

export const filter = (filter) => {
  return (dispatch, getState) => {
    dispatch({
      type: 'FILTER',
      payload: { filter },
    });
    const state = getState();

    const filteredTodos = filterTodos(dispatch, {
      filter: state.todos.filter,
      todos: state.todos.todos,
    });
    updateCurrentTodos(dispatch, {
      todos: filteredTodos,
      state: state.todos,
      currentPage: 1,
    });
  };
};

export const setPageLimit = (newPageLimit) => {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_PAGE_LIMIT', payload: newPageLimit });
    const state = getState();
    updateCurrentTodos(dispatch, {
      todos: state.todos.filteredTodos,
      state: state.todos,
      currentPage: 1,
    });
  };
};
