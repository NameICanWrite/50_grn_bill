import React, { useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectAuthLoading } from '../../redux/loading.slice';
import { selectCurrentUserIsAdmin, selectCurrentUserShouldBeActivated } from '../../redux/user/user.slice';

const PrivateRoute = ({
  component: Component,
  redirectUrl,
  isAuthenticated,
  isLoading,
  isAdmin,
  shouldBeActivated,
  isForAdmin,
  ...rest
}) => {
  return (
  (((isAuthenticated || isLoading) && !shouldBeActivated && (!isForAdmin || isAdmin || isLoading))) 
    ? 
      <Component {...rest} isLoading={isLoading} /> 
    : 
      shouldBeActivated 
      ?
        <Navigate to="/activate-with-code" />
      :
        <Navigate to="/register" />
);}


const mapStateToProps = state => ({
  isAuthenticated: selectAuthLoading(state).success,
  shouldBeActivated: selectCurrentUserShouldBeActivated(state),
  isAdmin: selectCurrentUserIsAdmin(state),
});

export default connect(mapStateToProps)(PrivateRoute)
