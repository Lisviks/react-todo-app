import React from 'react';

const LoginForm = () => {
  return (
    <form className='login-form'>
      <h1>Login</h1>
      <input type='email' placeholder='Email' />
      <input type='password' placeholder='Password' />
      <button className='btn'>Login</button>
    </form>
  );
};

export default LoginForm;
