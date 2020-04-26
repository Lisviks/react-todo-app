import { auth, firestore } from '../config/firebase';

export const login = (email, password) => {
  return async (dispatch) => {
    try {
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

export const onloadLogin = (id, username, email) => ({
  type: 'ONLOAD_LOGIN',
  payload: { id, username, email },
});
