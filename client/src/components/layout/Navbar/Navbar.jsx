import React, {  } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout, selectCurrentUser } from '../../../redux/user/user.slice';
import { selectAuthLoading } from '../../../redux/loading.slice';
import styles from './Navbar.module.sass'


const Navbar = ({ isAuthenticated, logout, currentUser }) => {
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
        <Link to="/posts">
          Posts
        </Link>
      </h1>
        <>{isAuthenticated ? authLinks : guestLinks}</>
      )
    </nav>
  );
};


const mapStateToProps = state => ({
  isAuthenticated: selectAuthLoading(state).success,
  currentUser: selectCurrentUser(state)
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
