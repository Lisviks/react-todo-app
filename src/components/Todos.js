import React, { Component, Fragment } from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import { firestore } from '../config/firebase';
import PageLimit from './PageLimit';
import Filter from './Filter';
import Loader from './Loader';
import { connect } from 'react-redux';
import { loadTodos, addTodo, editTodo } from '../actions/todosActions';

class Todos extends Component {
  state = {
    todos: [],
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

    this.setState({ todos: this.props.todos, currentTodos, loading: false });
  }

  checkComplete = (id) => {
    const todos = [...this.state.todos].map((todo) => {
      if (todo.id === id) {
        todo.complete = !todo.complete;
        firestore
          .collection('users')
          .doc(this.props.user.id)
          .collection('todos')
          .doc(id)
          .update({ complete: todo.complete });
      }
      return todo;
    });

    const currentTodos = this.updateCurrentTodos(this.filterTodos());

    this.setState({ todos, currentTodos });
  };

  deleteTodo = async (id) => {
    const todos = this.state.todos.filter((todo) => todo.id !== id);
    this.setState({ todos });
    await firestore
      .collection('users')
      .doc(this.props.user.id)
      .collection('todos')
      .doc(id)
      .delete();

    const currentTodos = this.updateCurrentTodos(this.filterTodos());

    this.setState({ currentTodos });
  };

  startEdit = (id, text) => {
    this.setState({
      formState: this.state.todos.filter((todo) => todo.id === id)[0],
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

      // const todos = this.state.todos.map((todo) => {
      //   if (this.state.formState.id === todo.id) {
      //     todo.text = this.state.formText;

      //     firestore
      //       .collection('users')
      //       .doc(this.props.user.id)
      //       .collection('todos')
      //       .doc(todo.id)
      //       .update({ text: todo.text });
      //   }
      //   return todo;
      // });
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
      this.state.todos,
      newPageLimit
    );

    this.setState({
      pageLimit: newPageLimit,
      currentTodos,
      currentPage: 1,
    });
  };

  filterTodos = (filter = this.state.filter) => {
    const filteredTodos = [...this.state.todos].filter((todo) => {
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

const mapDispatchToProps = { loadTodos, addTodo, editTodo };

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
