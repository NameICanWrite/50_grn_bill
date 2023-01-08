import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter, useNavigate, useNavigationType, Navigate } from 'react-router-dom';

import NotFound from '../pages/NotFound/NotFound';
import PrivateRoute from './PrivateRoute';
import { connect } from 'react-redux';
import AuthMenu, { PasswordAuthMenu } from '../pages/Auth/AuthMenu';
import Landing from '../pages/Landing/Landing';
import { selectAllUsersLoading, selectAuthLoading, selectCurrentUserLoading, selectPostsLoading } from '../../redux/loading.slice';
import ProfileContainer from "../pages/profile/Profile.container";
import Dashboard from "../pages/dashboard/Dashboard";
import PasswordReset from "../pages/password-reset/PasswordReset.Component";
import { Modal } from '@mui/material';
import Login from '../pages/Auth/password-auth/Login';
import Register from '../pages/Auth/password-auth/Register';
import ActivationPage from '../pages/Auth/ActivationPage';
import Posts from '../pages/Posts/Posts';
import ReceiveTitlePage from '../pages/ReceiveTitlePage/ReceiveTitlePage';
import RewardPage from '../pages/RewardPage/RewardPage';

class DebugRouter extends BrowserRouter {
  constructor(props){
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null,2))
    this.history.listen((location, action)=>{
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      )
      console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null,2));
    });
  }
}


const MyRoutes = ({isAuthLoading, isCurrentUserLoading, isAllUsersLoading, isPostsLoading}) => {
  useEffect(() => console.log('isAuthLoading || isCurrentUserLoading = ' + isAuthLoading || isCurrentUserLoading))
  return (
    // <DebugRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/posts"/>}/>
        <Route  path='/landing'  element={<Landing />} />
        <Route  path='/dashboard' element={
          <PrivateRoute  
            isLoading={isAuthLoading || isCurrentUserLoading} 
            component={() => <Dashboard isLoading={isCurrentUserLoading}/>} />
        } />
        <Route path='/profile/:userId/*' element={
          <ProfileContainer />
        } />
        <Route path={ '/reset-password/:token' } element={<PasswordReset />}/>
        <Route  path={'/register'} element={<Register />} />
        <Route  path={`/login`} element={<Login />} />
        <Route path={`/activate-with-code`} element={<ActivationPage isLoading={isCurrentUserLoading} />} />
        <Route path={'/posts/*'} element={<Posts isLoading={isPostsLoading || isAllUsersLoading || isCurrentUserLoading}/>} />
        <Route path={'/receive-random-title/*'} element={<ReceiveTitlePage />}/>
        <Route path='/reward' element={
          <RewardPage isLoading={
            false// isAuthLoading || isCurrentUserLoading
          } />
        }/>
        <Route path="*" element={<NotFound/>} />
      </Routes>
    // </DebugRouter>
  )

};

const mapStateToProps = (state) => ({
  isCurrentUserLoading: selectCurrentUserLoading(state).isLoading,
  isAuthLoading: selectAuthLoading(state).isLoading,
  isAllUsersLoading: selectAllUsersLoading(state).isLoading,
  isPostsLoading: selectPostsLoading(state).isLoading,
})

export default connect(mapStateToProps, null)(MyRoutes);
