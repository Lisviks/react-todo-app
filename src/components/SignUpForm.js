import React from 'react';

const SignUpForm = ({ showLogin }) => {
  return (
    <form className='signup-form'>
      <h1>Sign up</h1>
      <input type='text' placeholder='Username' />
      <input type='email' placeholder='Email' />
      <input type='password' placeholder='Password' />
      <button className='btn'>Sign up</button>
      <span>
        Already have an account?{' '}
        <button className='a-tag-btn' onClick={showLogin}>
          Login
        </button>
      </span>
    </form>
  );
};

export default SignUpForm;
