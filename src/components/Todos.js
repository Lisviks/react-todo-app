import React, { Component, Fragment } from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import { firestore } from '../config/firebase';

class Todos extends Component {
  state = {
    todos: [
      { id: 1, text: 'Buy some milk', complete: false },
      { id: 2, text: 'Mow grass', complete: true },
      { id: 3, text: 'Read a book', complete: false },
    ],
    formText: '',
    editState: null,
  };

  saveLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  async componentDidMount() {
    const res = await firestore.collection('todos').get();
    const todos = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    this.setState({ todos });
  }

  checkComplete = (id) => {
    const todos = [...this.state.todos];
    todos.map((todo) => {
      if (todo.id === id) {
        todo.complete = !todo.complete;
        firestore
          .collection('todos')
          .doc(id)
          .update({ complete: todo.complete });
      }
      return todo;
    });
    this.setState({ todos });
  };

  deleteTodo = (id) => {
    const todos = this.state.todos.filter((todo) => todo.id !== id);
    this.setState({ todos });
    firestore.collection('todos').doc(id).delete();
  };

  startEdit = (id, text) => {
    this.setState({
      editState: this.state.todos.filter((todo) => todo.id === id)[0],
      formText: text,
    });
  };

  handleFormChange = (e) => {
    this.setState({ formText: e.target.value });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    if (!this.state.editState) {
      const todos = [
        ...this.state.todos,
        {
          id: Math.floor(Math.random() * 1000000),
          text: this.state.formText,
          complete: false,
        },
      ];

      firestore
        .collection('todos')
        .add({ text: this.state.formText, complete: false });

      this.setState({ todos, formText: '' });
    } else {
      const todos = this.state.todos.map((todo) => {
        if (this.state.editState.id === todo.id) {
          todo.text = this.state.formText;

          firestore
            .collection('todos')
            .doc(todo.id)
            .update({ text: todo.text });
        }
        return todo;
      });
      this.setState({ todos, formText: '', editState: null });
    }
  };

  render() {
    const todosList = this.state.todos.length
      ? this.state.todos.map((todo) => (
          <Todo
            todo={todo}
            checkComplete={this.checkComplete}
            startEdit={this.startEdit}
            deleteTodo={this.deleteTodo}
            key={todo.id}
          />
        ))
      : 'No todos...';

    return (
      <Fragment>
        <AddTodo
          editState={this.state.editState}
          formText={this.state.formText}
          handleFormChange={this.handleFormChange}
          handleFormSubmit={this.handleFormSubmit}
        />
        <ul className='collection'>{todosList}</ul>
      </Fragment>
    );
  }
}

export default Todos;
