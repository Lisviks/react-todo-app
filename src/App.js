import React, { Component } from 'react';
import Todos from './components/Todos';
import ThemeSwitch from './components/ThemeSwitch';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';

class App extends Component {
  state = {
    darkTheme: false,
  };

  componentDidMount() {
    const darkTheme = JSON.parse(localStorage.getItem('theme'));
    this.setState({ darkTheme }, () => {
      if (this.state.darkTheme) {
        console.log(this.state);
        document.querySelector('body').classList = 'dark';
      } else {
        console.log(this.state);
        document.querySelector('body').classList = 'light';
      }
    });
  }

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

  render() {
    return (
      <div className='container'>
        <ThemeSwitch
          switchTheme={this.switchTheme}
          currentTheme={this.currentTheme}
        />
        <h1>Todo App</h1>
        <Todos />
      </div>
    );
  }
}

export default App;
