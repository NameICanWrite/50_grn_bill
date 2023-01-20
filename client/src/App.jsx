import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import Landing from './components/pages/Landing/Landing';
import MyRoutes from './components/routes/MyRoutes';
// Redux
import { connect, Provider } from 'react-redux';

import styles from './App.module.sass';
import { createStructuredSelector } from 'reselect';
import { getAllUsers, getCurrentUser, selectCurrentUser } from './redux/user/user.slice';
import { getAllPosts } from './redux/post/post.slice';
import {LinkPreview} from "@dhaiwat10/react-link-preview"
import { setShowNavHamburger } from './redux/modals/modals.slice';


const App = ({ getCurrentUser, getAllUsers, getAllPosts, setShowNavHamburger, currentUser }) => {
  useEffect(() => {
    getAllUsers()
    getCurrentUser()
    getAllPosts()

  }, [])
  return (
      <section className={styles.container}>
        <Navbar />
        {/* <LinkPreview url="https://www.npmjs.com/package/@dhaiwat10/react-link-preview"/> */}
        <div className={styles.mainContainer} onClick={() => setShowNavHamburger(false)}>
          <MyRoutes />
        </div>
        
      </section>
  )
};

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser
})

const mapDispatchToProps = (dispatch) => ({
  getCurrentUser: () => dispatch(getCurrentUser()),
  getAllUsers: () => dispatch(getAllUsers()),
  getAllPosts: () => dispatch(getAllPosts()),
  setShowNavHamburger: (payload) => dispatch(setShowNavHamburger(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
