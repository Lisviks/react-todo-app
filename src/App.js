import React, { Component, Fragment } from 'react';
import Todos from './components/Todos';
import ThemeSwitch from './components/ThemeSwitch';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import { firestore, auth } from './config/firebase';
import Loader from './components/Loader';
import { connect } from 'react-redux';
import { logout, onloadLogin } from './actions/authActions';
import { loadTheme, setTheme } from './actions/themeActions';

class App extends Component {
  state = {
    darkTheme: false,
    loginForm: true,
    loading: true,
  };

  componentDidMount() {
    this.props.loadTheme();

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const res = await firestore.collection('users').doc(user.uid).get();
        const userData = res.data();

        this.props.onloadLogin({
          id: user.uid,
          username: userData.username,
          email: userData.email,
        });
      } else {
        this.props.onloadLogin(null);
      }
    });
  }

  switchTheme = () => {
    let theme;
    if (this.props.theme === 'light') theme = 'dark';
    if (this.props.theme === 'dark') theme = 'light';

    this.props.setTheme(theme);

    document.querySelector('body').classList.toggle('light');
    document.querySelector('body').classList.toggle('dark');
  };

  showSignUp = (e) => {
    e.preventDefault();
    console.log('showsginup');
    this.setState({ loginForm: false });
  };

  showLogin = (e) => {
    e.preventDefault();
    console.log('showlogin');
    this.setState({ loginForm: true });
  };

  render() {
    return (
      <div className='container'>
        {this.props.loading ? (
          <Loader />
        ) : (
          <Fragment>
            <div className='header'>
              <ThemeSwitch switchTheme={this.switchTheme} />
              {this.props.user && (
                <button className='btn logout-btn' onClick={this.props.logout}>
                  Logout
                </button>
              )}
            </div>
            {this.props.user ? (
              <Fragment>
                <div className='todo-app'>
                  <h1>Todo App</h1>
                  <Todos user={this.props.user} />
                </div>
              </Fragment>
            ) : (
              <Fragment>
                {this.state.loginForm ? (
                  <LoginForm showSignUp={this.showSignUp} />
                ) : (
                  <SignUpForm showLogin={this.showLogin} />
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state.theme);
  return {
    user: state.auth.user,
    loading: state.auth.loading,
    theme: state.theme.theme,
  };
};

const mapDispatchToProps = { logout, onloadLogin, loadTheme, setTheme };

export default connect(mapStateToProps, mapDispatchToProps)(App);
