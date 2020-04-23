import React from 'react';

const SignUpForm = () => {
  return (
    <form className='signup-form'>
      <h1>Sign up</h1>
      <input type='text' placeholder='Username' />
      <input type='email' placeholder='Email' />
      <input type='password' placeholder='Password' />
      <button className='btn'>Sign up</button>
    </form>
  );
};

export default SignUpForm;
