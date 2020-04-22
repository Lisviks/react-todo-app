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
    lastVisible: null,
    currentTodos: [],
    currentPage: 1,
    pageLimit: 5,
    totalPagesLoaded: 1,
    // Filter
    filter: 'all',
    filteredTodos: [],
  };

  fetchTodos = async (pageLimit) => {
    const res = await firestore
      .collection('todos')
      .orderBy('createdAt', 'desc')
      .limit(pageLimit)
      .get();

    return res;
  };

  updateCurrentPageTodos = (todos = this.state.todos) => {
    const { currentPage, pageLimit } = this.state;
    const currentTodos = [...todos]
      .splice(currentPage * pageLimit - pageLimit)
      .splice(0, pageLimit);

    this.setState({ currentTodos });
  };

  async componentDidMount() {
    const res = await this.fetchTodos(this.state.pageLimit);

    const todos = res.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    this.setState({
      todos,
      currentTodos: todos,
      lastVisible: res.docs[res.docs.length - 1],
    });
  }

  checkComplete = (id) => {
    const todos = [...this.state.todos].map((todo) => {
      if (todo.id === id) {
        todo.complete = !todo.complete;
        firestore
          .collection('todos')
          .doc(id)
          .update({ complete: todo.complete });
      }
      return todo;
    });

    this.updateCurrentPageTodos();

    this.setState({ todos });
  };

  deleteTodo = async (id) => {
    const {
      currentPage,
      pageLimit,
      lastVisible,
      totalPagesLoaded,
    } = this.state;

    const todos = this.state.todos.filter((todo) => todo.id !== id);
    this.setState({ todos });
    await firestore.collection('todos').doc(id).delete();

    if (
      currentPage === totalPagesLoaded ||
      this.state.todos.length === pageLimit
    ) {
      const res = await firestore
        .collection('todos')
        .orderBy('createdAt', 'desc')
        .startAfter(lastVisible)
        .limit(pageLimit)
        .get();
      const todos = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      this.setState({
        todos: [...this.state.todos, ...todos],
        lastVisible: res.docs[res.docs.length - 1],
        totalPagesLoaded: totalPagesLoaded + 1,
      });
    }

    this.updateCurrentPageTodos();
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
      const res = await firestore.collection('todos').add({
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

      this.updateCurrentPageTodos(todos);

      this.setState({ todos, formText: '' });

      // Edit todo
    } else {
      const todos = this.state.todos.map((todo) => {
        if (this.state.formState.id === todo.id) {
          todo.text = this.state.formText;

          firestore
            .collection('todos')
            .doc(todo.id)
            .update({ text: todo.text });
        }
        return todo;
      });

      this.updateCurrentPageTodos();

      this.setState({ todos, formText: '', formState: null });
    }
  };

  handleNext = async () => {
    const {
      lastVisible,
      currentTodos,
      currentPage,
      pageLimit,
      totalPagesLoaded,
    } = this.state;

    if (currentTodos.length < pageLimit) {
      this.setState({ lastVisible: null });
      return;
    }
    if (lastVisible && currentPage >= totalPagesLoaded) {
      const res = await firestore
        .collection('todos')
        .orderBy('createdAt', 'desc')
        .startAfter(lastVisible)
        .limit(pageLimit)
        .get();
      const todos = res.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      this.setState({
        todos: [...this.state.todos, ...todos],
        currentTodos: todos,
        lastVisible: res.docs[res.docs.length - 1],
        currentPage: currentPage + 1,
        totalPagesLoaded: totalPagesLoaded + 1,
      });
    } else {
      const todos = [...this.state.todos]
        .splice(currentPage * pageLimit)
        .splice(0, pageLimit);

      this.setState({
        currentTodos: todos,
        currentPage: currentPage + 1,
      });
    }
  };

  handlePrev = async () => {
    const { currentPage, pageLimit } = this.state;

    if (currentPage === 1) return;

    const todos = [...this.state.todos]
      .splice(currentPage * pageLimit - pageLimit * 2)
      .splice(0, pageLimit);

    this.setState({
      currentTodos: todos,
      currentPage: currentPage - 1,
    });
  };

  setPageLimit = async (newPageLimit) => {
    const res = await this.fetchTodos(newPageLimit);

    const todos = res.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    this.setState({
      todos,
      currentTodos: todos,
      lastVisible: res.docs[res.docs.length - 1],
      pageLimit: newPageLimit,
      currentPage: 1,
      totalPagesLoaded: 1,
    });
  };

  filterTodos = (filter) => {
    const filteredTodos = [...this.state.todos].filter((todo) => {
      if (filter === 'active') return !todo.complete;
      if (filter === 'complete') return todo.complete;
      return todo;
    });

    this.setState({ filter, filteredTodos });
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
        <Filter filterTodos={this.filterTodos} />
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
