import React, { Component } from 'react';
import Todos from './components/Todos';
import ThemeSwitch from './components/ThemeSwitch';

class App extends Component {
  state = {
    darkTheme: true,
  };

  componentDidMount() {
    const darkTheme = JSON.parse(localStorage.getItem('theme'));
    this.setState({ darkTheme });

    if (this.state.darkTheme) {
      document.querySelector('body').classList = 'dark';
    } else {
      document.querySelector('body').classList = 'light';
    }
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
