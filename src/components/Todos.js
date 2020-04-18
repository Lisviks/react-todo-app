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
    formState: null,
    // Pagination
    lastVisible: null,
    currentTodos: [],
    currentPage: 1,
    pageLimit: 5,
    totalPagesLoaded: 1,
    // Sub todo
    currentTodoId: null,
    subTodoText: '',
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

      const todos = [
        {
          id: res.id,
          text: this.state.formText,
          complete: false,
          subTodos: [],
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
        if (this.state.formState.id === todo.id) {
          todo.text = this.state.formText;

          firestore
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

  getTodoId = (id) => {
    this.setState({ currentTodoId: id });
  };

  handleSubTodoSubmit = async (e) => {
    e.preventDefault();

    const res = await firestore
      .collection('todos')
      .doc(this.state.currentTodoId)
      .collection('subTodos')
      .add({
        text: this.state.subTodoText,
        complete: false,
        createdAt: Date.now(),
      });

    const todos = [...this.state.todos].map((todo) => {
      if (todo.id === this.state.currentTodoId) {
        todo.subTodos = [
          {
            id: res.id,
            text: this.state.subTodoText,
            complete: false,
          },
          ...todo.subTodos,
        ];
      }
      return todo;
    });

    console.log(todos);
  };

  render() {
    const todosList = this.state.currentTodos.length
      ? this.state.currentTodos.map((todo) => (
          <Todo
            todo={todo}
            checkComplete={this.checkComplete}
            startEdit={this.startEdit}
            deleteTodo={this.deleteTodo}
            getTodoId={this.getTodoId}
            key={todo.id}
          />
        ))
      : 'No todos...';

    return (
      <Fragment>
        <AddTodo
          formState={this.state.formState}
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
        {/* <!-- Modal Structure --> */}
        <div id='sub-todo-modal' className='modal'>
          <div className='modal-content'>
            <h4>Add sub-todo</h4>
            <form onSubmit={this.handleSubTodoSubmit}>
              <div className='input-field'>
                <input
                  type='text'
                  id='subTodoText'
                  onChange={this.handleFormChange}
                  value={this.state.subTodoText}
                />
                <label htmlFor='subTodoText'></label>
              </div>
              <button className='btn'>Add</button>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Todos;
