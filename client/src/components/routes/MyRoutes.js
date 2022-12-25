import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter, useNavigate, useNavigationType } from 'react-router-dom';

import NotFound from '../pages/NotFound/NotFound';
import PrivateRoute from './PrivateRoute';
import { connect } from 'react-redux';
import AuthMenu, { PasswordAuthMenu } from '../pages/Auth/AuthMenu';
import Landing from '../pages/Landing/Landing';
import { selectAllUsersLoading, selectAuthLoading, selectCurrentUserLoading } from '../../redux/loading.slice';
import ProfileContainer from "../pages/profile/Profile.container";
import Dashboard from "../pages/dashboard/Dashboard";
import PasswordReset from "../pages/password-reset/PasswordReset.Component";
import { Modal } from '@mui/material';
import { ProfileRoutes } from './ProfileRoutes';
import Login from '../pages/Auth/password-auth/Login';
import Register from '../pages/Auth/password-auth/Register';
import ActivationPage from '../pages/Auth/ActivationPage';
import Posts from '../pages/Posts/Posts';

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


const MyRoutes = ({isAuthLoading, isCurrentUserLoading, isAllUsersLoading}) => {
  useEffect(() => console.log('isAuthLoading || isCurrentUserLoading = ' + isAuthLoading || isCurrentUserLoading))
  return (
    // <DebugRouter>
      <Routes>
        <Route  path='/'  element={<Landing />} />
        <Route  path='/dashboard' element={
          <PrivateRoute  
            isLoading={isAuthLoading || isCurrentUserLoading} 
            component={() => <Dashboard isLoading={isCurrentUserLoading}/>} />
        } />
        <Route path='/profile/:userId/*' element={
          <PrivateRoute  
            isLoading={isAuthLoading || isCurrentUserLoading || isAllUsersLoading} 
            component={ProfileRoutes} />
        } />
        <Route path={ '/reset-password/:token' } element={<PasswordReset />}/>
        <Route  path={'/register'} element={<Register />} />
        <Route  path={`/login`} element={<Login />} />
        <Route path={`/activate-with-code`} element={<ActivationPage />} />
        <Route path={'/posts/*'} element={<Posts />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    // </DebugRouter>
  )

};

const mapStateToProps = (state) => ({
  isCurrentUserLoading: selectCurrentUserLoading(state).isLoading,
  isAuthLoading: selectAuthLoading(state).isLoading,
  isAllUsersLoading: selectAllUsersLoading(state).isLoading
})

export default connect(mapStateToProps, null)(MyRoutes);
