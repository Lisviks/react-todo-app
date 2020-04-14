import React from 'react';

const Todo = ({ todo, checkComplete }) => {
  const handleChange = () => {
    checkComplete(todo.id);
    console.log(todo);
  };

  return (
    <li>
      <label>
        <input
          type='checkbox'
          checked={todo.complete}
          onChange={handleChange}
        />
        <span>{todo.text}</span>
      </label>
    </li>
  );
};

export default Todo;
