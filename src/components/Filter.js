import React from 'react';

const Filter = ({ filterTodos }) => {
  const changeFilter = (e) => {
    document
      .querySelectorAll('button')
      .forEach((button) => button.classList.remove('active'));

    switch (e.target.textContent) {
      case 'Active':
        filterTodos('active');
        e.target.classList.toggle('active');
        break;
      case 'Complete':
        filterTodos('complete');
        e.target.classList.toggle('active');
        break;
      default:
        filterTodos('all');
        e.target.classList.toggle('active');
        break;
    }
  };

  return (
    <ul className='filter-list'>
      <li>
        <button className='btn active' onClick={changeFilter}>
          All
        </button>
      </li>
      <li>
        <button className='btn' onClick={changeFilter}>
          Active
        </button>
      </li>
      <li>
        <button className='btn' onClick={changeFilter}>
          Complete
        </button>
      </li>
    </ul>
  );
};

export default Filter;
