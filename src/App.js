import React, { Component, Fragment } from 'react';
import Todos from './components/Todos';
import ThemeSwitch from './components/ThemeSwitch';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import { firestore, auth } from './config/firebase';
import Loader from './components/Loader';
import { connect } from 'react-redux';

class App extends Component {
  state = {
    darkTheme: false,
    loginForm: true,
    loading: true,
  };

  componentDidMount() {
    const darkTheme = JSON.parse(localStorage.getItem('theme'));
    this.setState({ darkTheme }, () => {
      if (this.state.darkTheme) {
        document.querySelector('body').classList = 'dark';
      } else {
        document.querySelector('body').classList = 'light';
      }
    });

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const res = await firestore.collection('users').doc(user.uid).get();
        const userData = res.data();

        this.props.dispatch({
          type: 'LOGIN',
          payload: {
            id: user.uid,
            username: userData.username,
            email: userData.email,
          },
        });
        this.setState({ loading: false });
      } else {
        this.setState({ user: null, loading: false });
      }
    });
  }

  logout = () => {
    auth.signOut();
    this.setState({ user: null });
  };

  switchTheme = () => {
    this.setState({ darkTheme: !this.state.darkTheme }, () =>
      localStorage.setItem('theme', JSON.stringify(this.state.darkTheme))
    );

    document.querySelector('body').classList.toggle('light');
    document.querySelector('body').classList.toggle('dark');
  };

  currentTheme = () => {
    return this.state.darkTheme;
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
        {this.state.loading ? (
          <Loader />
        ) : (
          <Fragment>
            <div className='header'>
              <ThemeSwitch
                switchTheme={this.switchTheme}
                currentTheme={this.currentTheme}
              />
              {this.props.user && (
                <button className='btn logout-btn' onClick={this.logout}>
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
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(App);
