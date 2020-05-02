import { auth, firestore } from '../config/firebase';

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      dispatch({ type: 'SET_AUTH_LOADING' });
      const res = await auth.signInWithEmailAndPassword(email, password);
      const user = await firestore.collection('users').doc(res.user.uid).get();
      const userData = user.data();

      dispatch({
        type: 'LOGIN',
        payload: {
          id: res.user.uid,
          username: userData.username,
          email: userData.email,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const signUp = (username, email, password) => {
  return async (dispatch) => {
    try {
      dispatch({ type: 'SET_AUTH_LOADING' });
      const res = await auth.createUserWithEmailAndPassword(email, password);

      await firestore.collection('users').doc(res.user.uid).set({
        email,
        username,
        createdAt: Date.now(),
      });

      dispatch({
        type: 'SIGN_UP',
        payload: { id: res.user.uid, username, email },
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    auth.signOut();

    dispatch({ type: 'LOGOUT' });
  };
};

export const onloadLogin = (user) => {
  return (dispatch, getState) => {
    if (!getState().auth.user) {
      dispatch({
        type: 'ONLOAD_LOGIN',
        payload: { user },
      });
    }
  };
};

export const switchForm = (e) => {
  e.preventDefault();
  return (dispatch) => {
    dispatch({ type: 'SWITCH_AUTH_FORM' });
  };
};
