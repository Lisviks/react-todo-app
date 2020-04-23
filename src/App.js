import React, { Component } from 'react';
import Todos from './components/Todos';
import ThemeSwitch from './components/ThemeSwitch';

class App extends Component {
  render() {
    return (
      <div className='container'>
        <ThemeSwitch />
        <h1>Todo App</h1>
        <Todos />
      </div>
    );
  }
}

export default App;
