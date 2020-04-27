import React from 'react';
import { connect } from 'react-redux';
import { filter } from '../actions/todosActions';

const Filter = ({ filter }) => {
  const changeFilter = (e) => {
    document
      .querySelectorAll('button')
      .forEach((button) => button.classList.remove('active'));

    switch (e.target.textContent) {
      case 'Active':
        filter('active');
        e.target.classList.toggle('active');
        break;
      case 'Complete':
        filter('complete');
        e.target.classList.toggle('active');
        break;
      default:
        filter('all');
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

const mapDispatchToProps = {
  filter,
};

export default connect(null, mapDispatchToProps)(Filter);
