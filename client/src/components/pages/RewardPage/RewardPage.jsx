import styles from './RewardPage.module.sass'

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectCurrentUser } from '../../../redux/user/user.slice'
import rewardApi from '../../../api/reward.api'
import DivWithSpinner from '../../layout/DivWithSpinner'
import { useCallback } from 'react'
import validator from 'validator'
import Cleave from 'cleave.js/react'
import { selectAuthLoading, selectCurrentUserLoading } from '../../../redux/loading.slice'

const RewardPage = ({user: {didAddPost, didAddAvatar, didLikePost, didReceiveTitle, isWhitelisted, didReceiveReward}, isAuthenticated}) => {
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
	
	return (
		<div className={styles.container}>
			<h2>What to do to receive 50 grn:</h2>
			<p>{isAuthenticated ? '✔️' : '❌'} Register</p>
			<p>{didAddPost ? '✔️' : '❌'} Create a post</p>
			<p>{didAddAvatar ? '✔️' : '❌'} Add avatar to profile</p>
			<p>{didLikePost ? '✔️' : '❌'} Like 1 post</p>
			<p>{didReceiveTitle ? '✔️' : '❌'} Receive a title</p>
			<p>{isWhitelisted ? '✔️' : '❌'} Get whitelisted</p>
			{/* {isEligible && <input type={'card'} onChange={(event) => setCardNumber(event.target.value)}/>} */}
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
		</div>
	)
}

const mapStateToProps = (state) => ({
	user: selectCurrentUser(state),
	isAuthenticated: selectAuthLoading(state).success
})

const mapDispatchToProps = (dispatch) => ({})



export default connect(mapStateToProps, mapDispatchToProps)(RewardPage)


