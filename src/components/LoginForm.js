import React from 'react';

const LoginForm = ({ showSingUp, login }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = data.get('email');
    const password = data.get('password');

    login(email, password);
  };

  return (
    <form className='login-form' onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Password' required />
      <button className='btn'>Login</button>
      <span>
        Need account?{' '}
        <button className='change-form-btn' onClick={showSingUp}>
          Sign up
        </button>
      </span>
    </form>
  );
};

export default LoginForm;
