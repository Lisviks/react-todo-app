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
