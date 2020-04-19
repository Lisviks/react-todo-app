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
      <div
        className='valign-wrapper'
        style={{ justifyContent: 'space-between' }}
      >
        <label>
          <input
            type='checkbox'
            checked={todo.complete}
            onChange={handleChange}
          />
          <span>{todo.text}</span>
        </label>
        <div className='buttons right'>
          <button className='btn-floating btn-small' onClick={handleEditClick}>
            <i className='material-icons' style={{ margin: 0 }}>
              edit
            </i>
          </button>
          <button
            className='btn-floating btn-small red darken-1'
            onClick={handleDeleteClick}
          >
            <i className='material-icons' style={{ margin: 0 }}>
              delete_forever
            </i>
          </button>
        </div>
      </div>
    </li>
  );
};

export default Todo;
