import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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
import { selectShowNavHamburger, setShowNavHamburger } from './redux/modals/modals.slice';
import InfoModal from './components/layout/InfoModal/InfoModal';
import { selectAuthLoading, selectCurrentUserLoading } from './redux/loading.slice';


const App = ({ getCurrentUser, getAllUsers, getAllPosts, setShowNavHamburger, currentUser, isCurrentUserLoading, showNavHamburger }) => {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getAllUsers()
    getCurrentUser()
    getAllPosts()

  }, [])

  useEffect(() => {
    const lastShown = localStorage.getItem('shownRewardModalAt')
    const notShowingTooOften = !lastShown || new Date().getTime() - new Date(lastShown).getTime() > 3600000 //only 1 time a hour
    !isCurrentUserLoading && !currentUser?.didReceiveReward && console.log('would show modal');
    if (!isCurrentUserLoading && !currentUser?.didReceiveReward && notShowingTooOften) {
      setTimeout(() =>{
        setShowModal(true)
        localStorage.setItem('shownRewardModalAt', new Date().toISOString())
      }, 10000)
    }
  }, [isCurrentUserLoading])

  const onCloseModal = () => {
    setShowModal(false)
  }
  const onModalButtonClick = () => {
    onCloseModal()
    navigate('/reward')
  }
  return (
      <section className={styles.container}>
        <Navbar />
        {/* <LinkPreview url="https://www.npmjs.com/package/@dhaiwat10/react-link-preview"/> */}
        <div className={styles.mainContainer} onClick={() => showNavHamburger && setShowNavHamburger(false)}>
          <MyRoutes />
        </div>
        <InfoModal open={showModal} 
        header={'Акція!'} 
        text={'Привіт! Окрім всього іншого, цей проект уміє видавати 50 грн на 🍺.'} 
        buttonText={'Правила'}
        onButtonClick={onModalButtonClick}
        onClose={onCloseModal}
        />
      </section>
  )
};

const mapStateToProps = (state) => ({
  currentUser: selectCurrentUser(state),
  isCurrentUserLoading: selectCurrentUserLoading(state).isLoading,
  showNavHamburger: selectShowNavHamburger(state),
})

const mapDispatchToProps = (dispatch) => ({
  getCurrentUser: () => dispatch(getCurrentUser()),
  getAllUsers: () => dispatch(getAllUsers()),
  getAllPosts: () => dispatch(getAllPosts()),
  setShowNavHamburger: (payload) => dispatch(setShowNavHamburger(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
