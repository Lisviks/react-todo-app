import React, { Component } from 'react';

class AddTodo extends Component {
  state = {
    text: '',
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.addTodo(this.state.text);
    this.setState({ text: '' });
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className='input-field'>
          <input
            type='text'
            id='text'
            value={this.state.text}
            onChange={this.handleChange}
          />
          <label htmlFor='text'></label>
        </div>
        <button className='btn'>Add</button>
      </form>
    );
  }
}

export default AddTodo;
