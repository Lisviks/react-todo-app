import React, { Component } from 'react';
import Todos from './components/Todos';
import ThemeSwitch from './components/ThemeSwitch';

class App extends Component {
  state = {
    theme: 'light',
  };

  switchTheme = () => {
    const theme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setState({ theme });
  };

  render() {
    return (
      <div
        data-theme={this.state.theme}
        style={{ minHeight: '100vh', padding: '1rem' }}
      >
        <div className='container'>
          <ThemeSwitch
            switchTheme={this.switchTheme}
            theme={this.state.theme}
          />
          <h1>Todo App</h1>
          <Todos />
        </div>
      </div>
    );
  }
}

export default App;
