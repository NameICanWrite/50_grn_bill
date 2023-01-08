import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginWithGoogle, loginWithNameAndPassword, selectCurrentUser } from '../../../../redux/user/user.slice';
import AuthMessage from '../../../layout/AuthMessage';
import { resetAuthLoadingMessage, selectAuthLoading } from '../../../../redux/loading.slice';

import styles from '../Auth.module.sass'
import GoogleLoginButton from '../oauth-buttons/GoogleLoginButton';
import WithSpinner from '../../../layout/WithSpinner/WithSpinner';

const Login = ({ login, isAuthenticated, isLoading, match, location, loginWithGoogle, isLoadingAuth, currentUser, resetAuthMessage }) => {
  const [formData, setFormData] = useState({
    emailOrName: '',
    password: ''
  });

  useEffect(() => {
    resetAuthMessage()
  }, [])

  const { emailOrName, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    login({ emailOrName, password });
  };

  if (isAuthenticated) {
    return <Navigate to={'/profile/' + currentUser._id} />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Увійдіть</h1>
      {/* <p className={styles.preHeader}> Sign Into Your Account</p> */}

      <form className={styles.form} onSubmit={e => onSubmit(e)}>
        <div className={styles.name}>
          <input
            id='email-input'
            type='text'
            placeholder="Ім'я або E-mail"
            name='emailOrName'
            value={emailOrName}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div  className={styles.password}>
          <input
            id='password-input'
            type='password'
            placeholder='Пароль'
            name='password'
            value={password}
            onChange={e => onChange(e)}
            minLength='1'
          />
        </div>
        <div className={`${styles.message} ${styles.error}`}>
          <AuthMessage isLoading={isLoading} spinnerContainerClassName={styles.spinnerContainer} spinnerClassName={styles.spinner}/>
        </div>
        <input type='submit' className={styles.submit} value='Увійти' />
        <p className={styles.hint}>
          Ще не зареєстровані? <Link to={`/register`}>Зареєструйтеся</Link>
        </p>
        <hr />
      </form>
      
      
      <div className={styles.loginWithGoogleWrapper}>
        <p>Або увійдіть із Google</p>
        <GoogleLoginButton handleToken={loginWithGoogle} isLoading={false} />
      </div>
    </div>
  );
};



const mapStateToProps = state => ({
  isAuthenticated: selectAuthLoading(state).success,
  isLoading: selectAuthLoading(state).isLoading,
  currentUser: selectCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  login: (credentials) => dispatch(loginWithNameAndPassword(credentials)),
  loginWithGoogle: (token) => dispatch(loginWithGoogle({ token })),
  resetAuthMessage: () => dispatch(resetAuthLoadingMessage())
})

export default WithSpinner(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login));
