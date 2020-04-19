import React from 'react';

const AddTodo = (props) => {
  const { handleFormSubmit, handleFormChange, formText, formState } = props;

  return (
    <form onSubmit={handleFormSubmit}>
      <div className='input-field'>
        <input
          type='text'
          className='grey lighten-5'
          id='formText'
          value={formText}
          onChange={handleFormChange}
        />
        <label htmlFor='text'>Add todo...</label>
      </div>
      <button className='btn'>{formState ? 'Edit' : 'Add'}</button>
    </form>
  );
};

export default AddTodo;
