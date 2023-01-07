import React, { } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout, selectCurrentUser } from '../../../redux/user/user.slice';
import { selectAuthLoading } from '../../../redux/loading.slice';
import emptyAvatar from '../../../assets/img/empty-avatar.jpg'
import styles from './Navbar.module.sass'
import baseUrl from '../../../api/baseUrl';
import DivWithSpinner from '../DivWithSpinner';


const Navbar = ({ isAuthenticated, isAuthLoading, logout, currentUser }) => {
  const authLinks = [
    // <div className={styles.navLink}>
    //   <Link to='/dashboard'>
    //     <span className={styles.hide_if_small}>Dashboard</span>
    //   </Link>
    // </div>,
    <div className={styles.navLink}>
      <Link to={`/profile/${currentUser?._id}`}>
        🆔 Account
      </Link>
    </div>,
    <div className={styles.navLink}>
      <Link to='/landing' onClick={logout}>↪️ Logout</Link>
    </div>
  ]

  const guestLinks = [
    <div className={styles.navLink}>
      <Link to='/login'>Login</Link>
    </div>
  ]

  return (
    <nav className={styles.navbar}>
      <h1>
        <Link to='/landing'>
          Unoriginal startup ideas
        </Link>
      </h1>
      <div className={styles.navContainer}>
        <div className={styles.navLink}>
          <Link to="/posts">
            📝 Posts
          </Link>
        </div>
        <div className={styles.navLink}>
          <Link to="/reward">
            🤑 Get 50 grn reward!
          </Link>
        </div>
        <div className={styles.navLink}>
          <Link to="/landing">
            🧐 About
          </Link>
        </div>
        <>{!isAuthLoading && (isAuthenticated ? authLinks : guestLinks)}</>
      </div>
      {/* {
        isAuthenticated &&
        <DivWithSpinner className={styles.currentUserInfo} isLoading={isAuthLoading}>


          <img src={currentUser.avatar ? `${baseUrl}/image/${currentUser.avatar}` : emptyAvatar} alt="avatar" className={styles.avatar} />
          <div className={styles.userName}>{currentUser.name}</div>
            
        </DivWithSpinner>
      } */}


    </nav>
  );
};


const mapStateToProps = state => ({
  isAuthenticated: selectAuthLoading(state).success,
  isAuthLoading: selectAuthLoading(state).isLoading,
  currentUser: selectCurrentUser(state)
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
