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
import { Modal } from '@mui/material'

const RewardPage = ({ user: { _id, didAddPost, didAddAvatar, didLikePost, didReceiveTitle, isWhitelisted, didReceiveReward, shouldBeActivated }, isUserLoading, isAuthenticated, getCurrentUser, isAuthLoading }) => {
	const [isAskForRewardLoading, setIsAskForRewardLoading] = useState(false)
	const [askForRewardSuccess, setAskForRewardSuccess] = useState('')
	const [askForRewardError, setAskForRewardError] = useState('')
	const [didntUseEffect, setDidntUseEffect] = useState(true)
	const [isWhitelistExplanationOpen, setIsWhitelistExplanationOpen] = useState(false)

	const [cardNumber, setCardNumber] = useState('')
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
	useEffect(() => {
		console.log(isWhitelistExplanationOpen);
	}, [])


	return (
		<DivWithSpinner isLoading={isUserLoading || isAuthLoading || didntUseEffect} className={styles.container}>
			<h2 className={styles.header}>Виконайте завдання і отримайте 50 грн</h2>
			<div className={styles.checkpoints}>
				<Link to={'/register'}>
					<span className={styles.check}>{isAuthenticated && !shouldBeActivated ? '✔️' : '❌'}</span><p className={styles.link}>Зареєструйтесь</p>
				</Link>
				<Link to={isAuthenticated ? '/posts/create-post' : '/register'}>
					<span className={styles.check}>{didAddPost ? '✔️' : '❌'}</span><p className={styles.link}>Створіть 1 пост</p>
				</Link>
				<Link to='/posts'>
					<span className={styles.check}>{didLikePost ? '✔️' : '❌'}</span><p className={styles.link}>Лайкніть 1 пост</p>
				</Link>
				<Link to={isAuthenticated ? `/profile/${_id}/set-avatar` : '/register'} >
					<span className={styles.check}>{didAddAvatar ? '✔️' : '❌'}</span><p className={styles.link}>Додайте аватар у профіль</p>
				</Link>
				<Link to={'/receive-random-title'}>
					<span className={styles.check}>{didReceiveTitle ? '✔️' : '❌'}</span><p className={styles.link}>Отримайте звання</p>
				</Link>
				<Link onClick={() => setIsWhitelistExplanationOpen(true)}>
					<span className={styles.check}>{(isWhitelisted || didReceiveReward) ? '✔️' : '❌'}</span><p className={styles.link}>Візьміть участь у вайтлисті</p>
				</Link>
				
			</div>
			{isEligible && <Cleave
				options={{ creditCard: true }}
				// onFocus={this.onCreditCardFocus}
				placeholder={'Введіть номер карти'}
				autocomplete="cc-number" x-autocompletetype="cc-number"
				onChange={(event) => setCardNumber(event.target.value)}
			/>}
			
			{/* <p className={styles.explanation}>Виконайте всі завда</p> */}
			<Modal open={isWhitelistExplanationOpen}
			 onClose={() => setIsWhitelistExplanationOpen(false)}
			 >
				<div className={styles.explanationWrapper}>
					<p className={styles.explanation}>Вайтлист - це список імен тих хто може отримати винагороду. Можливо я вже додав твій нік з телеги. Або ще додам. Спробуй змінити нік на той який там</p>
					<button onClick={() => setIsWhitelistExplanationOpen(false)} className={`${styles.blackSubmit} ${styles.small}`}>Ok</button>
				</div>
				</Modal>

			<DivWithSpinner isLoading={isAskForRewardLoading} spinnerContainerClassName={styles.spinnerContainer}>
				{/* <p className={styles.success}>{askForRewardSuccess}</p> */}
				{
				!didReceiveReward && !askForRewardSuccess
					?
					[<button
						className={!isEligible ? styles.disabled : ''}
						disabled={!isEligible}
						onClick={async () => await askForReward()
						}>Отримати винагороду</button>,
						<p className={styles.error}>{askForRewardError}</p>
					]
					:
					<div>
						<p className={styles.received}>Нагороду вже вислано на вашу карту</p>
						<p className={styles.disclaimer}>Зверніть увагу! Кошти можуть іти протягом години...</p>
					</div>
			}
				
			</DivWithSpinner>
			{
				isAskForRewardLoading && <p className={styles.disclaimer}>Завантаження може тривати до 2-х хвилин... Відсилаю попри всі заборони</p>
			}
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


