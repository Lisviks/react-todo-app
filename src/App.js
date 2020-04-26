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

  signUp = async (username, email, password) => {
    try {
      this.setState({ loading: true });

      const res = await auth.createUserWithEmailAndPassword(email, password);

      this.setState({ user: { id: res.user.uid, username, email } });

      firestore.collection('users').doc(res.user.uid).set({
        email,
        username,
        createdAt: Date.now(),
      });

      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
    }
  };

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
              {this.props.auth && (
                <button className='btn logout-btn' onClick={this.logout}>
                  Logout
                </button>
              )}
            </div>
            {this.props.auth ? (
              <Fragment>
                <div className='todo-app'>
                  <h1>Todo App</h1>
                  <Todos user={this.props.auth.user} />
                </div>
              </Fragment>
            ) : (
              <Fragment>
                {this.state.loginForm ? (
                  <LoginForm showSingUp={this.showSignUp} login={this.login} />
                ) : (
                  <SignUpForm showLogin={this.showLogin} signUp={this.signUp} />
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
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(App);
