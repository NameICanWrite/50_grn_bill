import React, {  } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout, selectCurrentUser } from '../../../redux/user/user.slice';
import { selectAuthLoading } from '../../../redux/loading.slice';
import styles from './Navbar.module.sass'


const Navbar = ({ isAuthenticated, isAuthLoading, logout, currentUser }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/dashboard'>
          <span className={styles.hide_if_small}>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to={`/profile/${currentUser?._id}`}>
          ⚙️
        </Link>
      </li>
      {
        isAuthenticated ? 
          <li>
        <Link to='/' onClick={logout}>Logout</Link>
      </li> :
      ''
      }
      
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className={styles.navbar}>
      <h1>
        <Link to='/'>
           MERN Boilerplate
        </Link>
        
        {/* <Link to="/reward">
          Reward
        </Link> */}
      </h1>
      <ul>
        <li>
          <Link to="/posts">
            Posts
          </Link>
        </li>
        <li>
          <Link to="/reward">
            Get 50 grn reward!
          </Link>
        </li>
      </ul>
        
        
        <>{!isAuthLoading && (isAuthenticated ? authLinks : guestLinks)}</>
      )
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
