import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link, Route, Routes, Navigate, useLocation, useNavigation, useNavigate } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { selectAuthLoading, selectCurrentUserLoading } from '../../../redux/loading.slice'
import { loginWithGoogle } from '../../../redux/user/user.slice'
import AuthMessage from '../../layout/AuthMessage'
import GoogleLoginButton from './oauth-buttons/GoogleLoginButton'
import Login from './password-auth/Login'
import Register from './password-auth/Register'

import styles from './AuthMenu.module.sass'
import { useEffect } from 'react'

export function PasswordAuthMenu({ history, match }) {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	useEffect(() => {
		console.log( '/auth/with-password = '+ pathname)
	}, [pathname])

	useEffect(() => {
		
	
		console.log(123)
	}, [])
	
	return (
		<div>
			
			<Routes>
				<Route  path={`${pathname}/register`} element={<Register />} />
				<Route  path={`${pathname}/login`} element={<Login />} />

			</Routes>
			<div>
				<Link to={`${pathname}/register`} className={`${styles.btn} ${styles.primary}`}>
					Sign Up
				</Link>
				<Link to={`${pathname}/login`} className={`${styles.btn} ${styles.light}`}>
					Login
				</Link>
				<button onClick={() => navigate('./..')}>Choose auth method</button>
			</div>

		</div>
	)
}


function AuthMenu({ isAuthenticated, isLoadingUser, isLoadingAuth, loginWithGoogle, history, match }) {
	useEffect(() => console.log('loading auth'))
	const navigate = useNavigate()
	const { pathname } = useLocation()
	useEffect(() => console.log('/auth = ', pathname), [pathname])
	return (isAuthenticated) ? <Navigate to='/dashboard' /> : (
		<div>
				

			<div>
				<AuthMessage />
				<button className={styles.btn} onClick={() => navigate(`${pathname}/with-password`)}>via Name and password</button>
				<GoogleLoginButton handleToken={loginWithGoogle} isLoading={isLoadingAuth} />
			</div>
		</div>
	)
}

const mapStateToProps = state => ({
	isLoadingUser: selectCurrentUserLoading(state).isLoading,
	isLoadingAuth: selectAuthLoading(state).isLoading,
	isAuthenticated: selectAuthLoading(state).success
})

const mapDispatchToProps = (dispatch) => ({
	loginWithGoogle: (token) => dispatch(loginWithGoogle({ token })),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthMenu)
