import React from 'react';

const LoginForm = ({ showSingUp }) => {
  return (
    <form className='login-form'>
      <h1>Login</h1>
      <input type='email' placeholder='Email' />
      <input type='password' placeholder='Password' />
      <button className='btn'>Login</button>
      <span>
        Need account?{' '}
        <button className='a-tag-btn' onClick={showSingUp}>
          Sign up
        </button>
      </span>
    </form>
  );
};

export default LoginForm;
