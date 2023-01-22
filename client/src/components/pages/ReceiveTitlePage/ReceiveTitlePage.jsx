import styles from './ReceiveTitlePage.module.sass'

import React, { createRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Wheel } from "react-custom-roulette"
import { receiveTitle, selectCurrentUserPendingTitle, selectCurrentUserSpins, selectCurrentUserTitle, setCurrentUser, setPendingTitle, setTitle } from '../../../redux/user/user.slice'
import { selectCurrentUserLoading, selectReceiveTitleLoading } from '../../../redux/loading.slice'
import DivWithSpinner from '../../layout/DivWithSpinner'
import { Modal } from '@mui/material'
import { useRef } from 'react'
import titleApi from '../../../api/title.api'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { PurchaseStatusModal } from './PurchaseStatusModal'
import baseUrl from '../../../api/baseUrl'
import userApi from '../../../api/user.api'
import InfoModal from '../../layout/InfoModal/InfoModal'

const titles = [
	'Терміналтор',
	'Hard code and a hammer',
	'Звезда по имени User',
	'Той, хто біжить 2FA',
	'50grn bill Gates ',
	'Людина-web. Уже тиждень дома',
	'Мирний диванний воїн',
	'Кіберпанк 24/7',
	'Кодер да Вінчі',
	'Люк Skype Walker'
]

const defaultTitle = "Newbie"

const rouletteData = titles.map(title => ({ option: title }))

const ReceiveTitlePage = ({ title, pendingTitle, spins, receiveTitle, setTitle, setPendingTitle, setCurrentUser, loading, currentUserLoading }) => {
	const [prizeNumber, setPrizeNumber] = useState()
	const [mustSpin, setMustSpin] = useState(false)
	const [isModalWithResultOpen, setIsModalWithResultOpen] = useState(false)
	const [isDisclaimerModalOpen, setDisclaimerModalOpen] = useState(false)
	const [isBuySpinsLoading, setIsBuySpinsLoading] = useState(false)
	const [spinsToBuy, setSpinsToBuy] = useState(1)

	const formRef = createRef()

	const navigate = useNavigate()

	useEffect(() => {
		if (pendingTitle) {
			const titleIndex = rouletteData.findIndex(data => data.option == pendingTitle)
			setPrizeNumber(titleIndex)
			setMustSpin(true)
			setPendingTitle('')
		}

	}, [pendingTitle, setPendingTitle, setCurrentUser])
	useEffect(() => {
		console.log(title);
	}, [title])

	useEffect(() => {
    const lastShown = localStorage.getItem('shownPaymentDisclaimerModalAt')
    const notShowingTooOften = !lastShown || new Date().getTime() - new Date(lastShown).getTime() > 300000 //only 1 time in 5 minutes
    if (!currentUserLoading.isLoading && spins == 0 && title == defaultTitle && notShowingTooOften) { //user didnt use payment at all
      setTimeout(() =>{
        setDisclaimerModalOpen(true)
        localStorage.setItem('shownPaymentDisclaimerModalAt', new Date().toISOString())
      }, 3000)
    }
  }, [currentUserLoading.isLoading, spins, title])

	const onCloseDisclaimerModal = () => setDisclaimerModalOpen(false)

	async function onBuySpinsSubmit(event) {
		event.preventDefault()
		setIsBuySpinsLoading(true)
		const count = event.target.count.value
		const wayforpayData = await titleApi.postSingle('order-spins', {
			count
		}, { withCredentials: true })

		const {
			merchantSignature,
			amount,
			orderReference,
			orderDate,
			merchantAccount,
			merchantDomainName,
			currency,
			serviceUrl,
			paymentSystems,
			products
		} = wayforpayData

		wayforpayData.returnUrl = `${baseUrl}/redirect-to/${window.location.href}/order/${orderReference}`

		// populate the form
		for (let prop in wayforpayData) {
			const item = wayforpayData[prop]

			if ((typeof item == 'string') || (typeof item == 'number')) {
				console.log(item);

				const input = document.createElement('input')
				input.name = prop
				input.value = item
				input.type = 'hidden'
				event.target.append(input)
			}
		}

		for (let i in products) {
			const item = products[i]

			const nameInput = document.createElement('input')
			nameInput.name = 'productName[]'
			nameInput.value = item.name
			nameInput.type = 'hidden'
			event.target.append(nameInput)

			const countInput = document.createElement('input')
			countInput.name = 'productCount[]'
			countInput.value = item.count
			countInput.type = 'hidden'
			event.target.append(countInput)

			const priceInput = document.createElement('input')
			priceInput.name = 'productPrice[]'
			priceInput.value = item.price
			priceInput.type = 'hidden'
			event.target.append(priceInput)
		}
		event.target.submit()
		setIsBuySpinsLoading(false)
		console.log('btw code runs after submit');
	}

	return (
		<DivWithSpinner isLoading={currentUserLoading.isLoading} className={styles.container}>
			<h1 className={styles.header}>Отримайте звання!</h1>
			<p className={styles.currentTitle}>Зараз ваше звання <b>{title}</b></p>

			<div className={styles.wheelWrapper}>
				<Wheel
					mustStartSpinning={mustSpin}
					
					// mustStartSpinning={true}
					prizeNumber={prizeNumber}
					data={rouletteData}
					fontSize={10}
					backgroundColors={['#3f5fb4', '#df9928']}
					onStopSpinning={() => {
						setMustSpin(false)
						console.log('stop spinning')
						setTitle(titles[prizeNumber])
						setIsModalWithResultOpen(true)
						userApi.getSingle('one/current').then((data) => setCurrentUser(data)).catch()
					}}
				/>
			</div>

			{
			!mustSpin &&
			// false && 
				<DivWithSpinner isLoading={loading.isLoading} className={styles.bottomWrapper}>
					<button className={`${styles.spinButton} ${(!spins || spins < 1) ? styles.disabled : ''}`} disabled={!spins || spins < 1} onClick={() => {
						if (spins > 0) {
							receiveTitle()
						}
					}}>Крутіть щоб отримати звання</button>
					<p className={styles.spins}>У вас зараз <b>{spins}</b> спінів</p>
					<form className={styles.buySpinsForm} onSubmit={onBuySpinsSubmit} method="post" action="https://secure.wayforpay.com/pay" accept-charset="utf-8" ref={formRef}>
						<input type="hidden" name="merchantAuthType" value="SimpleSignature" /><input type="hidden" name="merchantTransactionSecureType" value="AUTO" /><input type="hidden" name="orderTimeout" value="5" /><input type="hidden" name="clientPhone" value="+380992856055" /><input type="hidden" name="clientEmail" value="some@mail.com" />
						

						<button type='submit' disabled={!spinsToBuy || spinsToBuy < 1} className={(!spinsToBuy || spinsToBuy < 1) ? styles.disabled : ''} >Купити спіни</button>
						<input type="number" defaultValue={1} min="1" name='count' onChange={(e) => setSpinsToBuy(e.target.value)} />
					</form>
					<p className={styles.disclaimer}>Зверніть увагу! Оплата тут з ціллю тестування. Це означає, що гроші одразу повернуться вам на карту. 1 спін = 2 грн 50 коп</p>

				</DivWithSpinner>
			}
			<Modal open={isModalWithResultOpen} onClose={() => setIsModalWithResultOpen(false)}>
				<div className={styles.resultModal}>
					<p className={styles.message}>{loading.message}</p> <button className={`${styles.blackSubmit} ${styles.setIsModalWithResultOpen}`} onClick={() => setIsModalWithResultOpen(false)}>Ok</button>
				</div>
			</Modal>
			<InfoModal
				header="Дисклеймер" 
				text="Зверніть увагу! Оплата тут з ціллю тестування. Це означає, що гроші одразу повернуться вам на карту. 1 спін = 2 грн 50 коп" 
				onClose={onCloseDisclaimerModal}
				open={isDisclaimerModalOpen}
			/>
			<Routes>
				<Route path='order/:orderId' element={<PurchaseStatusModal onClose={() => navigate('/receive-random-title')} />} />
			</Routes>
		</DivWithSpinner>
	)
}

const mapStateToProps = createStructuredSelector({
	title: selectCurrentUserTitle,
	pendingTitle: selectCurrentUserPendingTitle,
	spins: selectCurrentUserSpins,
	loading: selectReceiveTitleLoading,
	currentUserLoading: selectCurrentUserLoading
})
const mapDispatchToProps = (dispatch) => ({
	receiveTitle: () => dispatch(receiveTitle()),
	setTitle: (title) => dispatch(setTitle(title)),
	setPendingTitle: (title) => dispatch(setPendingTitle(title)),
	setCurrentUser: (user) => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReceiveTitlePage)


