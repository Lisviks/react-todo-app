import React, { Component, Fragment } from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';

class Todos extends Component {
  state = {
    todos: [
      { id: 1, text: 'Buy some milk', complete: false },
      { id: 2, text: 'Mow grass', complete: true },
      { id: 3, text: 'Read a book', complete: false },
    ],
  };

  checkComplete = (id) => {
    const todos = [...this.state.todos];
    todos.map((todo) => {
      if (todo.id === id) todo.complete = !todo.complete;
      return todo;
    });
    this.setState({ todos });
    console.log(this.state);
  };

  addTodo = (text) => {
    const todos = [
      ...this.state.todos,
      { id: Math.floor(Math.random() * 1000000), text, complete: false },
    ];
    this.setState({ todos });
  };

  render() {
    const todosList = this.state.todos.length
      ? this.state.todos.map((todo) => (
          <Todo todo={todo} checkComplete={this.checkComplete} key={todo.id} />
        ))
      : 'No todos...';

    return (
      <Fragment>
        <AddTodo addTodo={this.addTodo} />
        <ul>{todosList}</ul>
      </Fragment>
    );
  }
}

export default Todos;
