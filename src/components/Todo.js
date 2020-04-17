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
    <li className='collection-item'>
      <label>
        <input
          type='checkbox'
          checked={todo.complete}
          onChange={handleChange}
        />
        <span>{todo.text}</span>
      </label>
      <button
        className='btn btn-small secondary-content red darken-1'
        onClick={handleDeleteClick}
      >
        Delete
      </button>
      <button
        className='btn btn-small secondary-content'
        onClick={handleEditClick}
      >
        Edit
      </button>
      <button className='btn btn-small yellow darken-4 secondary-content'>
        Add Sub-todo
      </button>
    </li>
  );
};

export default Todo;
