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
} from '../actions/todosActions';

class Todos extends Component {
  state = {
    formText: '',
    formState: null,
    // Pagination
    currentTodos: [],
    currentPage: 1,
    pageLimit: 5,
    totalPagesLoaded: 1,
    // Filter
    filter: 'all',
    filteredTodos: [],
    // Loader
    loading: true,
  };

  updateCurrentTodos = (todos, pageLimit = this.state.pageLimit) => {
    const { currentPage } = this.state;
    let currentTodos;
    currentTodos = [...todos]
      .splice(currentPage * pageLimit - pageLimit)
      .splice(0, pageLimit);

    return currentTodos;
  };

  async componentDidMount() {
    await this.props.loadTodos(this.props.user.id);

    const currentTodos = this.updateCurrentTodos(this.props.todos);

    this.setState({ currentTodos, loading: false });
  }

  checkComplete = (todoId) => {
    const todo = this.props.todos.filter((todo) => todo.id === todoId)[0];
    const todoIndex = this.props.todos.indexOf(todo);
    const complete = !this.props.todos[todoIndex].complete;

    this.props.completeTodo(this.props.user.id, todoId, complete);

    const currentTodos = this.updateCurrentTodos(this.filterTodos());

    this.setState({ currentTodos });
  };

  deleteTodo = async (todoId) => {
    await this.props.deleteTodo(this.props.user.id, todoId);

    const currentTodos = this.updateCurrentTodos(this.filterTodos());

    this.setState({ currentTodos });
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
      this.props.addTodo(this.props.user.id, this.state.formText);

      const currentTodos = this.updateCurrentTodos(this.filterTodos());

      this.setState({ formText: '', currentTodos });

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

  handleNext = async () => {
    const { currentTodos, currentPage, pageLimit } = this.state;

    if (currentTodos.length < pageLimit) return;

    const todos = [...this.filterTodos()]
      .splice(currentPage * pageLimit)
      .splice(0, pageLimit);

    this.setState({
      currentTodos: todos,
      currentPage: currentPage + 1,
    });
  };

  handlePrev = async () => {
    const { currentPage, pageLimit } = this.state;

    if (currentPage === 1) return;

    const todos = [...this.filterTodos()]
      .splice(currentPage * pageLimit - pageLimit * 2)
      .splice(0, pageLimit);

    this.setState({
      currentTodos: todos,
      currentPage: currentPage - 1,
    });
  };

  setPageLimit = async (newPageLimit) => {
    const currentTodos = this.updateCurrentTodos(
      this.props.todos,
      newPageLimit
    );

    this.setState({
      pageLimit: newPageLimit,
      currentTodos,
      currentPage: 1,
    });
  };

  filterTodos = (filter = this.state.filter) => {
    const filteredTodos = [...this.props.todos].filter((todo) => {
      if (filter === 'active') return !todo.complete;
      if (filter === 'complete') return todo.complete;
      return todo;
    });

    this.setState({ filter });
    return filteredTodos;
  };

  handleFilterClick = (filter) => {
    const currentTodos = this.updateCurrentTodos(this.filterTodos(filter));
    this.setState({ currentTodos });
  };

  render() {
    const todosList = this.state.loading ? (
      <Loader />
    ) : this.state.currentTodos.length ? (
      this.state.currentTodos.map((todo) => (
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
        <Filter handleFilterClick={this.handleFilterClick} />
        <ul className='list'>{todosList}</ul>
        <button className='btn' onClick={this.handlePrev}>
          Previous
        </button>
        <button className='btn' onClick={this.handleNext}>
          Next
        </button>
        <PageLimit setPageLimit={this.setPageLimit} />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todos.todos,
  };
};

const mapDispatchToProps = {
  loadTodos,
  addTodo,
  editTodo,
  completeTodo,
  deleteTodo,
};

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
