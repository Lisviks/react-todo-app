import React from 'react';

const Todo = ({
  todo,
  checkComplete,
  startEdit,
  deleteTodo,
  getTodoId,
  showSubTodos,
}) => {
  const handleChange = () => {
    checkComplete(todo.id);
  };

  const handleEditClick = () => {
    startEdit(todo.id, todo.text);
  };

  const handleDeleteClick = () => {
    deleteTodo(todo.id);
  };

  const handleSubTodo = () => {
    getTodoId(todo.id);
  };

  const handleExpand = () => {
    showSubTodos(todo.id);
  };

  return (
    <li>
      <div
        className='collapsible-header valign-wrapper'
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
          <button
            className='btn btn-small grey lighten-2'
            onClick={handleExpand}
          >
            Expand
          </button>
          <button
            className='btn btn-small yellow darken-4 modal-trigger'
            data-target='sub-todo-modal'
            onClick={handleSubTodo}
          >
            Add Sub-todo
          </button>
          <button className='btn btn-small' onClick={handleEditClick}>
            Edit
          </button>
          <button
            className='btn btn-small red darken-1'
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>

      <div className='collapsible-body'>
        {todo.subTodos.length ? (
          <ul className='collection'>
            {todo.subTodos.map((todo) => (
              <li className='collection-item' key={todo.id}>
                <span className=''>{todo.text}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
};

export default Todo;
