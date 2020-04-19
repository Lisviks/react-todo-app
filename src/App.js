import React, { Component } from 'react';
import Todos from './components/Todos';

class App extends Component {
  render() {
    return (
      <div className='container'>
        <h1>Todo App</h1>
        <Todos />
      </div>
    );
  }
}

export default App;
