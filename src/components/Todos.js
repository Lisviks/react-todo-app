import React, { Component, Fragment } from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import { firestore } from '../config/firebase';
import PageLimit from './PageLimit';
import Filter from './Filter';

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
    const res = await firestore
      .collection('users')
      .doc(this.props.user.id)
      .collection('todos')
      .orderBy('createdAt', 'desc')
      .get();

    const todos = res.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const currentTodos = this.updateCurrentTodos(todos);

    this.setState({ todos, currentTodos });
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

      const res = await firestore
        .collection('users')
        .doc(this.props.user.id)
        .collection('todos')
        .add({
          text: this.state.formText,
          complete: false,
          createdAt: Date.now(),
        });

      const newTodo = {
        id: res.id,
        text: this.state.formText,
        complete: false,
      };

      const todos = [{ ...newTodo }, ...this.state.todos];

      const currentTodos = this.updateCurrentTodos(this.filterTodos());

      this.setState({ todos, formText: '', currentTodos });

      // Edit todo
    } else {
      if (!this.state.formText) return;

      const todos = this.state.todos.map((todo) => {
        if (this.state.formState.id === todo.id) {
          todo.text = this.state.formText;

          firestore
            .collection('users')
            .doc(this.props.user.id)
            .collection('todos')
            .doc(todo.id)
            .update({ text: todo.text });
        }
        return todo;
      });

      this.setState({ todos, formText: '', formState: null });
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
    const todosList = this.state.currentTodos.length ? (
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

export default Todos;
