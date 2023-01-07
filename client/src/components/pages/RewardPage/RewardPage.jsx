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

const RewardPage = ({user: {didAddPost, didAddAvatar, didLikePost, didReceiveTitle, isWhitelisted, didReceiveReward}, isUserLoading, isAuthenticated, getCurrentUser}) => {
	const [isAskForRewardLoading, setIsAskForRewardLoading] = useState(false)
	const [askForRewardSuccess, setAskForRewardSuccess] = useState('')
	const [askForRewardError, setAskForRewardError] = useState('')

	const [cardNumber, setCardNumber] = useState('')

	const isEligible = didAddPost && didAddAvatar && didLikePost && didReceiveTitle && isWhitelisted && !didReceiveReward 

	const askForReward = useCallback(async () => {
		if (!validator.isCreditCard(cardNumber)) return setAskForRewardError('Its not a card number')
		setIsAskForRewardLoading(true)
		rewardApi.postSingle('ask-for-reward', {cardNumber}).then((res) => {
			setAskForRewardSuccess(res)
			setAskForRewardError('')
		}).catch((err) => {
			setAskForRewardError(err.message)
		}).finally(() => setIsAskForRewardLoading(false))
	}, [cardNumber])

	useEffect(() => {
		console.log('get current user from reward page');
		getCurrentUser()
	}, [getCurrentUser])
	
	return (
		<DivWithSpinner isLoading={isUserLoading} className={styles.container}>
			<h2>What to do to receive 50 grn:</h2>
			<p>{isAuthenticated ? '✔️' : '❌'} Register</p>
			<p>{didAddPost ? '✔️' : '❌'} Create a post</p>
			<p>{didAddAvatar ? '✔️' : '❌'} Add avatar to profile</p>
			<p>{didLikePost ? '✔️' : '❌'} Like 1 post</p>
			<p>{didReceiveTitle ? '✔️' : '❌'} Receive a title</p>
			<p>{isWhitelisted ? '✔️' : '❌'} Get whitelisted</p>
			
			{isEligible && <Cleave 
				options={{creditCard: true}}
				// onFocus={this.onCreditCardFocus}
				placeholder={'Enter credit card number'}
				autocomplete="cc-number" x-autocompletetype="cc-number"
				onChange={(event) => setCardNumber(event.target.value)}
			/>}
			{
				!didReceiveReward 
					?
						<button 
							disabled={!isEligible} 
							onClick={async () => await askForReward()
						}>Receive reward!</button>
					:
						<p>Reward has been sent to your bank account!</p>
			
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
	isUserLoading: selectCurrentUserLoading(state).isLoading
})

const mapDispatchToProps = (dispatch) => ({
	getCurrentUser: () => dispatch(getCurrentUser())
})



export default WithSpinner(connect(mapStateToProps, mapDispatchToProps)(RewardPage))


