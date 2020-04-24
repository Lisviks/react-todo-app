import React from 'react';

const SignUpForm = ({ showLogin, signUp }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');

    signUp(username, email, password);
  };

  return (
    <form className='signup-form' onSubmit={handleSubmit}>
      <h1>Sign up</h1>
      <input type='text' name='username' placeholder='Username' />
      <input type='email' name='email' placeholder='Email' />
      <input type='password' name='password' placeholder='Password' />
      <button className='btn'>Sign up</button>
      <span>
        Already have an account?{' '}
        <button className='change-form-btn' onClick={showLogin}>
          Login
        </button>
      </span>
    </form>
  );
};

export default SignUpForm;
