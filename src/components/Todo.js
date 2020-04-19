import React from 'react';

const Todo = ({ todo, checkComplete, startEdit, deleteTodo }) => {
  const handleChange = () => {
    checkComplete(todo.id);
  };

  const handleEditClick = () => {
    startEdit(todo.id, todo.text);
  };

  const handleDeleteClick = () => {
    deleteTodo(todo.id);
  };

  return (
    <li className='list-item'>
      <div className='checkbox-field'>
        <input
          type='checkbox'
          className='chk'
          id={todo.id}
          checked={todo.complete}
          onChange={handleChange}
        />
        <label htmlFor={todo.id}>{todo.text}</label>
      </div>
      <div className='buttons'>
        <button className='btn btn-round blue' onClick={handleEditClick}>
          <i className='material-icons'>edit</i>
        </button>
        <button className='btn btn-round red' onClick={handleDeleteClick}>
          <i className='material-icons'>delete_forever</i>
        </button>
      </div>
    </li>
  );
};

export default Todo;
