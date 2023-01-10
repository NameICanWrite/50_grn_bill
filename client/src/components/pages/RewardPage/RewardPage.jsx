import styles from './RewardPage.module.sass'

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getCurrentUser, selectCurrentUser } from '../../../redux/user/user.slice'
import rewardApi from '../../../api/reward.api'
import DivWithSpinner from '../../layout/DivWithSpinner'
import { useCallback } from 'react'
import validator from 'validator'
import Cleave from 'cleave.js/react'
import { selectAuthLoading, selectCurrentUserLoading } from '../../../redux/loading.slice'
import WithSpinner from '../../layout/WithSpinner/WithSpinner'
import { Link } from 'react-router-dom'

const RewardPage = ({ user: { _id, didAddPost, didAddAvatar, didLikePost, didReceiveTitle, isWhitelisted, didReceiveReward }, isUserLoading, isAuthenticated, getCurrentUser, isAuthLoading }) => {
	const [isAskForRewardLoading, setIsAskForRewardLoading] = useState(false)
	const [askForRewardSuccess, setAskForRewardSuccess] = useState('')
	const [askForRewardError, setAskForRewardError] = useState('')
	const [didntUseEffect, setDidntUseEffect] = useState(true)

	const [cardNumber, setCardNumber] = useState('')
	didLikePost = false
	const isEligible = didAddPost && didAddAvatar && didLikePost && didReceiveTitle && isWhitelisted && !didReceiveReward

	const askForReward = useCallback(async () => {
		if (!validator.isCreditCard(cardNumber)) return setAskForRewardError('Its not a card number')
		setIsAskForRewardLoading(true)
		rewardApi.postSingle('ask-for-reward', { cardNumber }).then((res) => {
			setAskForRewardSuccess(res)
			setAskForRewardError('')
		}).catch((err) => {
			setAskForRewardError(err.message)
		}).finally(() => setIsAskForRewardLoading(false))
	}, [cardNumber])

	useEffect(() => {
		console.log('get current user from reward page');
		getCurrentUser()
		setDidntUseEffect(false)
	}, [])

	
	return (
		<DivWithSpinner isLoading={isUserLoading || isAuthLoading || didntUseEffect} className={styles.container}>
			<h2 className={styles.header}>Виконайте завдання і отримайте 50 грн</h2>
			<div className={styles.checkpoints}>
				<Link to='/register'>
					<p>{isAuthenticated ? '✔️' : '❌'} Register</p>
				</Link>
				<Link to={isAuthenticated ? '/posts/create-post' : '/register'}>
					<p>{didAddPost ? '✔️' : '❌'} Create a post</p>
				</Link>
				<Link to='/posts'>
					<p>{didLikePost ? '✔️' : '❌'} Like 1 post</p>
				</Link>
				<Link to={isAuthenticated ? `/profile/${_id}/set-avatar` : '/register'} >
					<p>{didAddAvatar ? '✔️' : '❌'} Add avatar to profile</p>
				</Link>
				<Link to={'/receive-random-title'}>
					<p>{didReceiveTitle ? '✔️' : '❌'} Receive a title</p>
				</Link>
				<p>{isWhitelisted ? '✔️' : '❌'} Get whitelisted</p>
			</div>
			{isEligible && <Cleave
				options={{ creditCard: true }}
				// onFocus={this.onCreditCardFocus}
				placeholder={'Enter credit card number'}
				autocomplete="cc-number" x-autocompletetype="cc-number"
				onChange={(event) => setCardNumber(event.target.value)}
			/>}
			{
				!didReceiveReward
					?
					<button
						className={!isEligible ? styles.disabled : ''}
						disabled={!isEligible}
						onClick={async () => await askForReward()
						}>Receive reward!</button>
					:
					<div>
						<p className={styles.received}>Нагороду вже вислано на вашу карту</p>
						<p className={styles.disclaimer}>Зверніть увагу! Кошти можуть іти протягом години...</p>
					</div>
					

			}
			<DivWithSpinner isLoading={isAskForRewardLoading}>
				<p className={styles.success}>{askForRewardSuccess}</p>
				<p className={styles.error}>{askForRewardError}</p>
			</DivWithSpinner>
		</DivWithSpinner>
	)
}

const mapStateToProps = (state) => ({
	user: selectCurrentUser(state),
	isAuthenticated: selectAuthLoading(state).success,
	isUserLoading: selectCurrentUserLoading(state).isLoading,
	isAuthLoading: selectAuthLoading(state).isLoading,
})

const mapDispatchToProps = (dispatch) => ({
	getCurrentUser: () => dispatch(getCurrentUser())
})



export default WithSpinner(connect(mapStateToProps, mapDispatchToProps)(RewardPage))


