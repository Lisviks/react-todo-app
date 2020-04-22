import React from 'react';

const Filter = ({ handleFilterClick }) => {
  const changeFilter = (e) => {
    document
      .querySelectorAll('button')
      .forEach((button) => button.classList.remove('active'));

    switch (e.target.textContent) {
      case 'Active':
        handleFilterClick('active');
        e.target.classList.toggle('active');
        break;
      case 'Complete':
        handleFilterClick('complete');
        e.target.classList.toggle('active');
        break;
      default:
        handleFilterClick('all');
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
