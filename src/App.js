import React, { Component, Fragment } from 'react';
import Todos from './components/Todos';
import ThemeSwitch from './components/ThemeSwitch';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import { firestore, auth } from './config/firebase';

class App extends Component {
  state = {
    darkTheme: false,
    user: null,
    loginForm: true,
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
  }

  login = async (email, password) => {
    const res = await auth.signInWithEmailAndPassword(email, password);

    const user = await firestore.collection('users').doc(res.user.uid).get();
    const userData = user.data();

    this.setState({
      user: {
        id: res.user.uid,
        username: userData.username,
        email: userData.email,
      },
    });
  };

  signUp = async (username, email, password) => {
    const res = await auth.createUserWithEmailAndPassword(email, password);

    this.setState({ user: { id: res.user.uid, username, email } });

    firestore.collection('users').doc(res.user.uid).set({
      email,
      username,
      createdAt: Date.now(),
    });
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
        <ThemeSwitch
          switchTheme={this.switchTheme}
          currentTheme={this.currentTheme}
        />
        {this.state.user ? (
          <Fragment>
            <h1>Todo App</h1>
            <Todos />
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
      </div>
    );
  }
}

export default App;
