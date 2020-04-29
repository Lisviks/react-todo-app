import React from 'react';
import { connect } from 'react-redux';
import { signUp, switchForm } from '../actions/authActions';

const SignUpForm = ({ signUp, switchForm }) => {
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
      <input type='text' name='username' placeholder='Username' required />
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Password' required />
      <button className='btn'>Sign up</button>
      <span>
        Already have an account?{' '}
        <button className='change-form-btn' onClick={switchForm}>
          Login
        </button>
      </span>
    </form>
  );
};

const mapDispatchToProps = { signUp, switchForm };

export default connect(null, mapDispatchToProps)(SignUpForm);
