

import React from 'react'
import { connect } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { selectAuthLoading, selectSendActivationCodeLoading } from '../../../redux/loading.slice'
import { activateAccountWithCode, selectCurrentUserShouldBeActivated, sendActivationCode } from '../../../redux/user/user.slice'
import DivWithSpinner from '../../layout/DivWithSpinner'

const ActivationPage = ({sendCode, activateWithCode, loading, sendCodeLoading, shouldBeActivated}) => {
	return (
		shouldBeActivated
		?
			<DivWithSpinner isLoading={loading.isLoading}>
				Please activate yourself
				<form onSubmit={(event) => {
					activateWithCode(event.target.code.value)
				}}>
					<input type="text" name="code" />
					<input type="submit" title='Activate'/>
				</form>
				<p>{loading.message}</p>
				<button onClick={sendCode}>Send activation code to email</button>
				<DivWithSpinner isLoading={sendCodeLoading.isLoading}>
					{sendCodeLoading.message}
				</DivWithSpinner>
			</DivWithSpinner>
		:
			<Navigate to="/dashboard" />
	)
}

const mapStateToProps = (state) => ({
	loading: selectAuthLoading(state),
	sendCodeLoading: selectSendActivationCodeLoading(state),
	shouldBeActivated: selectCurrentUserShouldBeActivated(state)
})

const mapDispatchToProps = (dispatch) => ({
	sendCode: () => dispatch(sendActivationCode()),
	activateWithCode: (code) => dispatch(activateAccountWithCode(code))
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivationPage)


