import React from 'react';

const AddTodo = (props) => {
  const { handleFormSubmit, handleFormChange, formText, formState } = props;

  return (
    <form className='form' onSubmit={handleFormSubmit}>
      <input
        type='text'
        className='text-input'
        id='formText'
        value={formText}
        onChange={handleFormChange}
        placeholder='Todo...'
      />
      <button className='btn'>{formState ? 'Edit' : 'Add'}</button>
    </form>
  );
};

export default AddTodo;
