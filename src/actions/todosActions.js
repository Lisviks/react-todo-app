import { firestore } from '../config/firebase';

export const loadTodos = (userId) => {
  return async (dispatch) => {
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

      dispatch({ type: 'LOAD_TODOS', payload: todos });
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
      .add({
        ...newTodo,
        // text,
        // complete: false,
        // createdAt: Date.now(),
      });

    // const newTodo = {
    //   id: res.id,

    // };

    dispatch({ type: 'ADD_TODO', payload: { ...newTodo, id: res.id } });
  };
};
