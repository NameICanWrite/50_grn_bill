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
    
      <Link to={`/profile/${currentUser?._id}`}>
        🆔 Account
      </Link>,
    
    
      <Link to='/landing' onClick={logout}>↪️ Logout</Link>
    
  ]

  const guestLinks = [
      <Link to='/login'>➡️ Login</Link>
  ]

  return (
    <nav className={styles.navbar}>
      <h1>
        <Link to='/landing'>
          Використані ідеї стартапів
        </Link>
      </h1>

      {/* normal navigation */}
      <div className={styles.navContainer} role='navigation'>
        
          <Link to="/posts">
            📝 Posts
          </Link>
        
        
          <Link to="/reward">
            🤑 Get 50 grn reward!
          </Link>
        
          <Link to="/landing">
            🧐 About
          </Link>
        
        {!isAuthLoading && (isAuthenticated ? authLinks : guestLinks)}
      </div>
      

      {/* hamburger menu */}
      <div id={styles["menuToggle"]}>
        <input type="checkbox" />

        <span></span>
        <span></span>
        <span></span>

        <ul id={styles["menu"]}>
          <Link to='/posts'><li>📝 Пости</li></Link>
          <Link to='/reward'><li>🤑 Винагорода</li></Link>
          <Link to='/about'><li>🧐 Про сайт</li></Link>
          {!isAuthLoading && (isAuthenticated ? authLinks : guestLinks).map(({props: {children, ...otherProps}}) => <Link {...otherProps}><li>{children}</li></Link>)}
        </ul>


      </div>


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
