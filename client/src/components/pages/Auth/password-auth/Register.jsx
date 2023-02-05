import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { resetAuthLoadingMessage, selectAuthLoading } from '../../../../redux/loading.slice';
import { createUserWithNameAndPassword, loginWithGoogle, selectCurrentUser } from '../../../../redux/user/user.slice';
import AuthMessage from '../../../layout/AuthMessage';
import WithSpinner from '../../../layout/WithSpinner/WithSpinner';

import styles from '../Auth.module.sass'
import GoogleLoginButton from '../oauth-buttons/GoogleLoginButton';


const Register = ({ register, isAuthenticated, isLoading, loginWithGoogle, isLoadingAuth, currentUser, resetAuthMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  useEffect(() => {
    resetAuthMessage()
  }, [])

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
    <div className={styles.container}>
      <h1 className={styles.header}>Зареєструйтеся</h1>
      {/* <p className={styles.preHeader}> Create Your Account</p> */}
      
      <form className={styles.form} onSubmit={e => onSubmit(e)}>
        <div className={styles.name}>
          <input
            type='text'
            placeholder="Ім'я"
            name='name'
            value={name}
            onChange={e => onChange(e)}
          />
          <p className={styles.hint}>(лише A-Z, a-z та _)</p>
        </div>
        <div className={styles.email}>
          <input
            type='text'
            placeholder='E-mail'
            name='email'
            value={email}
            onChange={e => onChange(e)}
          />
          <p className={styles.hint}>(щоб було важче реєструватися, звичайно ж)</p>
        </div>
        <div className={styles.password}>
          <input
            type='password'
            placeholder='Пароль'
            name='password'
            value={password}
            onChange={e => onChange(e)}
          />
          <p className={styles.hint}>(1234 - оптимальний варіант)</p>
        </div>
        <div className={`${styles.message} ${styles.error}`}>
          <AuthMessage isLoading={isLoading} spinnerContainerClassName={styles.spinnerContainer} spinnerClassName={styles.spinner}/>
        </div>
        <input type='submit' className={styles.submit} value='Зареєструватися' />
        <p>
          Уже маєте аккаунт? <Link to='/login'>Увійдіть</Link>
        </p>
        <hr />
      </form>

      
      <div className={styles.loginWithGoogleWrapper}>
        <p>Або увійти із Google</p>
        <GoogleLoginButton handleToken={loginWithGoogle} isLoading={false} />
      </div>
    </div>
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
  resetAuthMessage: () => dispatch(resetAuthLoadingMessage())
})

export default WithSpinner(connect(
  mapStateToProps,
  mapDispatchToProps
)(Register));
