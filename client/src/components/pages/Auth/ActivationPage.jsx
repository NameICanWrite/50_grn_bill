

import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { resetAuthLoadingMessage, resetSendActivationCodeLoadingMessage, selectAuthLoading, selectCurrentUserLoading, selectSendActivationCodeLoading } from '../../../redux/loading.slice'
import { activateAccountWithCode, selectCurrentUser, selectCurrentUserShouldBeActivated, sendActivationCode } from '../../../redux/user/user.slice'
import { isNumeric } from '../../../utils/isNumeric'
import AuthMessage from '../../layout/AuthMessage'
import DivWithSpinner from '../../layout/DivWithSpinner'
import WithSpinner from '../../layout/WithSpinner/WithSpinner'
import styles from './Auth.module.sass'

const ActivationPage = ({ sendCode, activateWithCode, authLoading, sendCodeLoading, shouldBeActivated, currentUser, isCurrentUserLoading, resetAuthMessage, resetSendCodeMessage }) => {
	const [code, setCode] = useState('')
	const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
	useEffect(() => {
		if (code.length === 6 && isNumeric(code)) setIsSubmitDisabled(false)
		else setIsSubmitDisabled(true)
	}, [code])

	return (

		shouldBeActivated
			?
			<div className={styles.container}>
				<h1 className={styles.header}>Активуйтеся</h1>

				<form className={styles.form} onSubmit={(event) => {
					event.preventDefault()
					resetSendCodeMessage()
					activateWithCode(event.target.code.value)

				}}>
					<div className={styles.codeInputWrapper}>
						<input type="number" name="code" placeholder='Введіть код активації' onChange={(e) => setCode(e.target.value)} />
					</div>

					<div className={styles.message}>
						<DivWithSpinner isLoading={authLoading.isLoading || sendCodeLoading.isLoading}
							spinnerContainerClassName={styles.spinnerContainer}
							spinnerClassName={styles.spinner}>
							{
								authLoading.message && <p className={`${styles.message} ${authLoading.success ? styles.success : styles.error}`}>
									{authLoading.message}
								</p>
							}
							{
								sendCodeLoading.message && <p className={`${styles.message} ${sendCodeLoading.success ? styles.success : styles.error}`}>
									{sendCodeLoading.message}
								</p>
							}
							{
								!sendCodeLoading.message && !authLoading.message && <p className={styles.message}></p>
							}
						</DivWithSpinner>
					</div>


					<input value='Активувати' 
					className={`${styles.submit} ${isSubmitDisabled ? styles.disabled : ''}`} type="submit" 
						disabled={isSubmitDisabled} 
					/>
					<button className={styles.sendCodeButton} onClick={(e) => {
						e.preventDefault()
						sendCode()
						resetAuthMessage()
					}}>Отримати код активації на {currentUser.email}</button>
				</form>


			</div>
			:
			<Navigate to={'/profile/' + currentUser._id} />
	)
}

const mapStateToProps = (state) => ({
	authLoading: selectAuthLoading(state),
	isCurrentUserLoading: selectCurrentUserLoading(state).isLoading,
	sendCodeLoading: selectSendActivationCodeLoading(state),
	shouldBeActivated: selectCurrentUserShouldBeActivated(state),
	currentUser: selectCurrentUser(state)
})

const mapDispatchToProps = (dispatch) => ({
	sendCode: () => dispatch(sendActivationCode()),
	activateWithCode: (code) => dispatch(activateAccountWithCode(code)),
	resetAuthMessage: () => dispatch(resetAuthLoadingMessage()),
	resetSendCodeMessage: () => dispatch(resetSendActivationCodeLoadingMessage())
})

export default WithSpinner(connect(mapStateToProps, mapDispatchToProps)(ActivationPage)
)

