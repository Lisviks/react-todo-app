import { firestore } from '../config/firebase';

const updateCurrentTodos = (todos, state, currentPage) => {
  const { pageLimit } = state;
  if (!currentPage) currentPage = state.currentPage;
  const currentTodos = [...todos]
    .splice(currentPage * pageLimit - pageLimit)
    .splice(0, pageLimit);

  return currentTodos;
};

const filterTodos = (filter, todos) => {
  const filteredTodos = [...todos].filter((todo) => {
    if (filter === 'active') return !todo.complete;
    if (filter === 'complete') return todo.complete;
    return todo;
  });
  console.log(filteredTodos);
  return filteredTodos;
};

export const loadTodos = (userId) => {
  return async (dispatch, getState) => {
    try {
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

      const state = getState();
      const currentTodos = updateCurrentTodos(todos, state.todos);

      dispatch({
        type: 'LOAD_TODOS',
        payload: { todos, currentTodos, filteredTodos: todos },
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
    const filteredTodos = filterTodos(state.todos.filter, todos);
    const currentTodos = updateCurrentTodos(filteredTodos, state.todos);

    dispatch({
      type: 'ADD_TODO',
      payload: { todo: { ...newTodo, id: res.id }, currentTodos },
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
      const filteredTodos = filterTodos(state.todos.filter, todos);
      const currentTodos = updateCurrentTodos(filteredTodos, state.todos);
      console.log(currentTodos);

      await firestore
        .collection('users')
        .doc(userId)
        .collection('todos')
        .doc(todoId)
        .update({ complete });

      dispatch({
        type: 'COMPLETE_TODO',
        payload: { todoId, currentTodos, complete },
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
      const todos = [
        ...state.todos.filteredTodos.filter((todo) => todo.id !== todoId),
      ];
      const currentTodos = updateCurrentTodos(todos, state.todos);

      dispatch({ type: 'DELETE_TODO', payload: { todoId, currentTodos } });
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
    const state = getState();
    const filteredTodos = filterTodos(filter, state.todos.todos);

    const currentTodos = updateCurrentTodos(filteredTodos, state.todos, 1);

    dispatch({
      type: 'FILTER',
      payload: { filter, filteredTodos, currentTodos },
    });
  };
};

export const setPageLimit = (newPageLimit) => {
  return (dispatch, getState) => {
    dispatch({ type: 'SET_PAGE_LIMIT', payload: newPageLimit });
    const state = getState();
    const currentTodos = updateCurrentTodos(state.todos.todos, state.todos, 1);

    dispatch({ type: 'UPDATE_CURRENT_TODOS', payload: currentTodos });
  };
};
