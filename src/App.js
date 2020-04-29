import React, { Fragment } from 'react';
import Todos from './components/Todos';
import ThemeSwitch from './components/ThemeSwitch';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import { firestore, auth } from './config/firebase';
import Loader from './components/Loader';
import { connect } from 'react-redux';
import { logout, onloadLogin } from './actions/authActions';
import { loadTheme, setTheme } from './actions/themeActions';

const App = (props) => {
  const { loadTheme, onloadLogin, loading, user, logout, loginForm } = props;

  loadTheme();

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const res = await firestore.collection('users').doc(user.uid).get();
      const userData = res.data();

      onloadLogin({
        id: user.uid,
        username: userData.username,
        email: userData.email,
      });
    } else {
      onloadLogin(null);
    }
  });

  return (
    <div className='container'>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className='header'>
            <ThemeSwitch />
            {user && (
              <button className='btn logout-btn' onClick={logout}>
                Logout
              </button>
            )}
          </div>
          {user ? (
            <div className='todo-app'>
              <h1>Todo App</h1>
              <Todos user={user} />
            </div>
          ) : loginForm ? (
            <LoginForm />
          ) : (
            <SignUpForm />
          )}
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    loading: state.auth.loading,
    loginForm: state.auth.loginForm,
    theme: state.theme.theme,
  };
};

const mapDispatchToProps = { logout, onloadLogin, loadTheme, setTheme };

export default connect(mapStateToProps, mapDispatchToProps)(App);
