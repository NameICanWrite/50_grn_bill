import React, { useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectAuthLoading } from '../../redux/loading.slice';
import { selectCurrentUserShouldBeActivated } from '../../redux/user/user.slice';

const PrivateRoute = ({
  component: Component,
  redirectUrl,
  isAuthenticated,
  isLoading,
  shouldBeActivated,
  ...rest
}) => {
  console.log(shouldBeActivated)
  return (
  ((isAuthenticated || isLoading) && !shouldBeActivated) 
    ? 
      <Component {...rest} isLoading={isLoading} /> 
    : 
      shouldBeActivated 
      ?
        <Navigate to="/activate-with-code" />
      :
        <Navigate to="/login" />
);}


const mapStateToProps = state => ({
  isAuthenticated: selectAuthLoading(state).success,
  shouldBeActivated: selectCurrentUserShouldBeActivated(state)
});

export default connect(mapStateToProps)(PrivateRoute)
