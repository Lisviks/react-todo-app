import React, { Component, Fragment } from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import PageLimit from './PageLimit';
import Filter from './Filter';
import Loader from './Loader';
import { connect } from 'react-redux';
import {
  loadTodos,
  addTodo,
  editTodo,
  completeTodo,
  deleteTodo,
  nextPage,
  prevPage,
} from '../actions/todosActions';

class Todos extends Component {
  state = {
    formText: '',
    formState: null,
    // Loader
    loading: true,
  };

  async componentDidMount() {
    await this.props.loadTodos(this.props.user.id);

    const currentTodos = this.props.currentTodos;

    this.setState({ currentTodos, loading: false });
  }

  checkComplete = (todoId) => {
    const todo = this.props.todos.filter((todo) => todo.id === todoId)[0];
    const todoIndex = this.props.todos.indexOf(todo);
    const complete = !this.props.todos[todoIndex].complete;

    this.props.completeTodo(this.props.user.id, todoId, complete);
  };

  deleteTodo = (todoId) => {
    this.props.deleteTodo(this.props.user.id, todoId);
  };

  startEdit = (id, text) => {
    this.setState({
      formState: this.props.todos.filter((todo) => todo.id === id)[0],
      formText: text,
    });
  };

  handleFormChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleFormSubmit = async (e) => {
    e.preventDefault();

    // Add new todo
    if (!this.state.formState) {
      if (!this.state.formText) return;
      await this.props.addTodo(this.props.user.id, this.state.formText);

      this.setState({ formText: '' });

      // Edit todo
    } else {
      if (!this.state.formText) return;

      this.props.editTodo(
        this.props.user.id,
        this.state.formState.id,
        this.state.formText
      );

      this.setState({ formText: '', formState: null });
    }
  };

  render() {
    const todosList = this.state.loading ? (
      <Loader />
    ) : this.props.currentTodos.length ? (
      this.props.currentTodos.map((todo) => (
        <Todo
          todo={todo}
          checkComplete={this.checkComplete}
          startEdit={this.startEdit}
          deleteTodo={this.deleteTodo}
          key={todo.id}
        />
      ))
    ) : (
      <div className='list-item'>No todos...</div>
    );

    return (
      <Fragment>
        <AddTodo
          formState={this.state.formState}
          formText={this.state.formText}
          handleFormChange={this.handleFormChange}
          handleFormSubmit={this.handleFormSubmit}
        />
        <Filter />
        <ul className='list'>{todosList}</ul>
        <button className='btn' onClick={this.props.prevPage}>
          Previous
        </button>
        <button className='btn' onClick={this.props.nextPage}>
          Next
        </button>
        <PageLimit />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state.todos);
  return {
    todos: state.todos.todos,
    currentTodos: state.todos.currentTodos,
  };
};

const mapDispatchToProps = {
  loadTodos,
  addTodo,
  editTodo,
  completeTodo,
  deleteTodo,
  nextPage,
  prevPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
