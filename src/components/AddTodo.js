import React from 'react';

const AddTodo = (props) => {
  const { handleFormSubmit, handleFormChange, formText, editState } = props;

  return (
    <form onSubmit={handleFormSubmit}>
      <div className='input-field'>
        <input
          type='text'
          id='text'
          value={formText}
          onChange={handleFormChange}
        />
        <label htmlFor='text'></label>
      </div>
      <button className='btn'>{editState ? 'Edit' : 'Add'}</button>
    </form>
  );
};

export default AddTodo;
