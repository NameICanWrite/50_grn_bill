import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginWithGoogle, loginWithNameAndPassword } from '../../../../redux/user/user.slice';
import AuthMessage from '../../../layout/AuthMessage';
import { selectAuthLoading } from '../../../../redux/loading.slice';

import styles from '../AuthMenu.module.sass'
import GoogleLoginButton from '../oauth-buttons/GoogleLoginButton';
import WithSpinner from '../../../layout/WithSpinner/WithSpinner';

const Login = ({ login, isAuthenticated, isLoading, match, location, loginWithGoogle, isLoadingAuth }) => {
  const [formData, setFormData] = useState({
    emailOrName: '',
    password: ''
  });

  const { emailOrName, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    login({ emailOrName, password });
  };

  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'> Sign Into Your Account</p>
      <AuthMessage isLoading={isLoading} />

      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            id='email-input'
            type='text'
            placeholder='nameOrEmail'
            name='emailOrName'
            value={emailOrName}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            id='password-input'
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
            minLength='1'
          />
        </div>
        <input type='submit' className={`${styles.btn} ${styles.primary}`} value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to={`/register`}>Sign Up</Link>
      </p>
      <hr />
      <p>or login with google</p>
      <GoogleLoginButton handleToken={loginWithGoogle} />
    </>
  );
};



const mapStateToProps = state => ({
  isAuthenticated: selectAuthLoading(state).success,
  isLoading: selectAuthLoading(state).isLoading
});

const mapDispatchToProps = (dispatch) => ({
  login: (credentials) => dispatch(loginWithNameAndPassword(credentials)),
  loginWithGoogle: (token) => dispatch(loginWithGoogle({ token })),
})

export default WithSpinner(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login));
