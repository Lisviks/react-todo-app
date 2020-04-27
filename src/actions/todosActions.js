import { firestore } from '../config/firebase';

const updateCurrentTodos = (todos, state) => {
  const { currentPage, pageLimit } = state;
  let currentTodos;
  currentTodos = [...todos]
    .splice(currentPage * pageLimit - pageLimit)
    .splice(0, pageLimit);

  return currentTodos;
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

      dispatch({ type: 'LOAD_TODOS', payload: { todos, currentTodos } });
    } catch (err) {
      console.log(err);
    }
  };
};

export const addTodo = (userId, text) => {
  return async (dispatch) => {
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

    dispatch({ type: 'ADD_TODO', payload: { ...newTodo, id: res.id } });
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
  return (dispatch) => {
    try {
      firestore
        .collection('users')
        .doc(userId)
        .collection('todos')
        .doc(todoId)
        .update({ complete });

      dispatch({ type: 'COMPLETE_TODO', payload: todoId });
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteTodo = (userId, todoId) => {
  return (dispatch) => {
    try {
      firestore
        .collection('users')
        .doc(userId)
        .collection('todos')
        .doc(todoId)
        .delete();

      dispatch({ type: 'DELETE_TODO', payload: todoId });
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

    const todos = [...state.todos.todos]
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

    const todos = [...state.todos.todos]
      .splice(currentPage * pageLimit - pageLimit * 2)
      .splice(0, pageLimit);

    dispatch({
      type: 'PREV_PAGE',
      payload: { currentTodos: todos, currentPage: currentPage - 1 },
    });
  };
};
