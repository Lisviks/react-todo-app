import React from 'react';

const Todo = ({ todo, checkComplete, startEdit }) => {
  const handleChange = () => {
    checkComplete(todo.id);
  };

  const handleClick = () => {
    startEdit(todo.id, todo.text);
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
      <button className='btn btn-small secondary-content' onClick={handleClick}>
        Edit
      </button>
    </li>
  );
};

export default Todo;
