import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getCurrentUser, modifyCurrentUserAvatar, selectCurrentUser } from '../../../redux/user/user.slice';
import brokenImage from '../../../assets/icons/broken-image.png'
import emptyAvatar from '../../../assets/img/empty-avatar.jpg'
import WithSpinner from '../../layout/WithSpinner/WithSpinner';

import styles from './Dashboard.module.sass'
import baseUrl from '../../../api/baseUrl';


const Dashboard = ({user, modifyCurrentUserAvatar}) => {

useEffect(() => console.log(user))
useEffect(() => console.log('loading dashboard'))
useEffect(() => console.log('user avatar is:' + user.avatar), [user.avatar])
  return (
    <>
      <h1 className={styles.header}>Welcome to the DashBoard!</h1>
      <img alt='avatar' className={styles.avatar} src={user?.avatar ? `${baseUrl}/image/${user?.avatar}` : emptyAvatar} />
      <p className={styles.userName}>{user ? `Welcome ${user?.name}` : `Error while loading user!`}</p>
      
    </>
  )
};

const mapStateToProps = state => ({
  user: selectCurrentUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  modifyCurrentUserAvatar: (avatar) => dispatch(modifyCurrentUserAvatar(avatar))
})

export default WithSpinner(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
