import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { selectAuthLoading } from '../../../../redux/loading.slice';
import { createUserWithNameAndPassword, loginWithGoogle, selectCurrentUser } from '../../../../redux/user/user.slice';
import AuthMessage from '../../../layout/AuthMessage';
import WithSpinner from '../../../layout/WithSpinner/WithSpinner';

import styles from '../AuthMenu.module.sass'
import GoogleLoginButton from '../oauth-buttons/GoogleLoginButton';


const Register = ({ register, isAuthenticated, isLoading, loginWithGoogle, isLoadingAuth, currentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { email, name, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    register({ name, password, email })
  };


  if (isAuthenticated && !currentUser.shouldBeActivated) {
    return <Navigate to={'/profile/' + currentUser._id} />;
  }

  if (isAuthenticated && currentUser.shouldBeActivated) {
    return <Navigate to={'/activate-with-code'} />;
  }

  return (
    <>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'> Create Your Account</p>
      <AuthMessage isLoading={isLoading} />
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className={`${styles.btn} ${styles.primary}`} value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
      <hr />
      <p>or login with google</p>
      <GoogleLoginButton handleToken={loginWithGoogle} isLoading={isLoading} />
    </>
  );
};


const mapStateToProps = state => ({
  isAuthenticated: selectAuthLoading(state).success,
  isLoading: selectAuthLoading(state).isLoading,
  currentUser: selectCurrentUser(state)
})

const mapDispatchToProps = (dispatch) => ({
  register: (credentials) => dispatch(createUserWithNameAndPassword(credentials)),
  loginWithGoogle: (token) => dispatch(loginWithGoogle({ token })),
})

export default WithSpinner(connect(
  mapStateToProps,
  mapDispatchToProps
)(Register));
