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
    // Pagination
    lastVisible: null,
    currentTodos: [],
    currentPage: 1,
    pageLimit: 5,
    totalPagesLoaded: 1,
  };

  saveLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  async componentDidMount() {
    const res = await firestore
      .collection('todos')
      .orderBy('createdAt', 'desc')
      .limit(this.state.pageLimit)
      .get();
    const todos = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    this.setState({
      todos,
      currentTodos: todos,
      lastVisible: res.docs[res.docs.length - 1],
    });
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

    const currentTodos = [...this.state.todos]
      .splice(currentPage * pageLimit - pageLimit)
      .splice(0, pageLimit);

    this.setState({ currentTodos });
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

  handleFormSubmit = async (e) => {
    e.preventDefault();

    // Add new todo
    if (!this.state.editState) {
      const res = await firestore.collection('todos').add({
        text: this.state.formText,
        complete: false,
        createdAt: Date.now(),
      });

      const todos = [
        {
          id: res.id,
          text: this.state.formText,
          complete: false,
        },
        ...this.state.todos,
      ];

      const currentTodos = [
        {
          id: res.id,
          text: this.state.formText,
          complete: false,
        },
        ...this.state.currentTodos,
      ];
      if (currentTodos.length > this.state.pageLimit) currentTodos.pop();

      this.setState({ todos, currentTodos, formText: '' });

      // Edit todo
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

  handleNext = async () => {
    const {
      lastVisible,
      currentTodos,
      currentPage,
      pageLimit,
      totalPagesLoaded,
    } = this.state;

    if (currentTodos.length < 5) {
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
      const todos = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      this.setState({
        todos: [...this.state.todos, ...todos],
        currentTodos: todos,
        lastVisible: res.docs[res.docs.length - 1],
        currentPage: currentPage + 1,
        totalPagesLoaded: totalPagesLoaded + 1,
      });
    } else {
      const todos = [...this.state.todos].splice(currentPage * 5).splice(0, 5);

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
      .splice(currentPage * 5 - pageLimit * 2)
      .splice(0, 5);

    this.setState({
      currentTodos: todos,
      currentPage: currentPage - 1,
    });
  };

  render() {
    const todosList = this.state.currentTodos.length
      ? this.state.currentTodos.map((todo) => (
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
        <button className='btn' onClick={this.handlePrev}>
          Previous
        </button>
        <button className='btn' onClick={this.handleNext}>
          Next
        </button>
      </Fragment>
    );
  }
}

export default Todos;
