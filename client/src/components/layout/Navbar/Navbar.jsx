import React, { } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout, selectCurrentUser } from '../../../redux/user/user.slice';
import { selectAuthLoading } from '../../../redux/loading.slice';
import emptyAvatar from '../../../assets/img/empty-avatar.jpg'
import styles from './Navbar.module.sass'
import baseUrl from '../../../api/baseUrl';
import DivWithSpinner from '../DivWithSpinner';
import { set } from 'lodash';
import { selectShowNavHamburger, setShowNavHamburger } from '../../../redux/modals/modals.slice';
import githubLogo from '../../../assets/img/github-logo.png'


const Navbar = ({ isAuthenticated, isAuthLoading, logout, currentUser, showNavHamburger, setShowNavHamburger }) => {
  const authLinks = [
    // <div className={styles.navLink}>
    //   <Link to='/dashboard'>
    //     <span className={styles.hide_if_small}>Dashboard</span>
    //   </Link>
    // </div>,
    
      <Link to={`/profile/${currentUser?._id}`} onClick={() => setShowNavHamburger(false)}>
        🆔 Аккаунт
      </Link>,
    
    
      <Link to='/landing' onClick={() => {
        logout()
        setShowNavHamburger(false)
      }}>↪️ Вийти</Link>
    
  ]

  const guestLinks = [
      <Link to='/login' onClick={() => setShowNavHamburger(false)}>➡️ Увійти</Link>
  ]

  return (
    <nav className={styles.navbar}>
      <h1>
        <Link to='/landing' onClick={() => setShowNavHamburger(false)}>
          Використані ідеї стартапів
        </Link>
      </h1>

      {/* normal navigation */}
      <div className={styles.navContainer} role='navigation'>
        
          <Link to="/posts">
          📝 Пости
          </Link>
        
        
          <Link to="/reward">
          🤑 Винагорода
          </Link>
        
          <Link to="/landing">
          🧐 Про сайт
          </Link>
        
        {!isAuthLoading && (isAuthenticated ? authLinks : guestLinks)}
      </div>
      {/* <Link><img className={styles.githubLogo} src={githubLogo} alt="github" /></Link> */}

      {/* hamburger menu */}
      <div id={styles["menuToggle"]}>
        <input type="checkbox" checked={showNavHamburger} onClick={() => setShowNavHamburger(!showNavHamburger)} />

        <span></span>
        <span></span>
        <span></span>

        <ul id={styles["menu"]}>
          <Link to='/posts' onClick={() => setShowNavHamburger(false)}><li>📝 Пости</li></Link>
          <Link to='/reward' onClick={() => setShowNavHamburger(false)}><li>🤑 Винагорода</li></Link>
          <Link to='/landing' onClick={() => setShowNavHamburger(false)}><li>🧐 Про сайт</li></Link>
          {!isAuthLoading && (isAuthenticated ? authLinks : guestLinks).map(({props: {children, ...otherProps}}) => <Link {...otherProps}><li>{children}</li></Link>)}
        </ul>


      </div>


    </nav>
  );
};


const mapStateToProps = state => ({
  isAuthenticated: selectAuthLoading(state).success,
  isAuthLoading: selectAuthLoading(state).isLoading,
  currentUser: selectCurrentUser(state),
  showNavHamburger: selectShowNavHamburger(state)
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  setShowNavHamburger: (payload) => dispatch(setShowNavHamburger(payload)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
