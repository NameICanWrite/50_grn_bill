import styles from './ReceiveTitlePage.module.sass'

import React, { createRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {Wheel} from "react-custom-roulette"
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

const titles = [
  'Терміналтор',
  'Hard code and a hammer',
  'Звезда по имени User',
  'Той, хто біжить 2FA: Випробування вогнем',
  '50grn bill Gates ',
  'Людина-web. Уже тиждень дома',
  'Мирний диванний воїн',
  'Кіберпанк 24/7',
  'Кодер да Вінчі',
  'Люк Skype Walker'
]

const rouletteData = titles.map(title => ({option: title}))

const ReceiveTitlePage = ({title, pendingTitle, spins, receiveTitle, setTitle, setPendingTitle, setCurrentUser, loading, currentUserLoading}) => {
	const [prizeNumber, setPrizeNumber] = useState()
	const [mustSpin, setMustSpin] = useState(false)
	const [isModalWithResultOpen, setIsModalWithResultOpen] = useState(false)
	const [isBuySpinsLoading, setIsBuySpinsLoading] = useState(false)

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


	async function onBuySpinsSubmit(event) {
		event.preventDefault()
		setIsBuySpinsLoading(true)
 		const count = event.target.count.value 
		 const wayforpayData = await titleApi.postSingle('order-spins', {
			count
		}, {withCredentials: true})

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
			<p>Your current title is {title}</p>
			<p>{spins} spins left</p>
			<Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={rouletteData}
        onStopSpinning={() => {
          setMustSpin(false)
					console.log('stop spinning')
					setTitle(titles[prizeNumber])
					setIsModalWithResultOpen(true)
					userApi.getSingle('one/current').then((data) => setCurrentUser(data)).catch()
        }}
      />
			{!mustSpin && 
				<DivWithSpinner isLoading={loading.isLoading}>
					<button onClick={() => {
						if (spins > 0) {
							receiveTitle()
						}
					}}>Spin to receive title</button>
						<form onSubmit={onBuySpinsSubmit} method="post" action="https://secure.wayforpay.com/pay" accept-charset="utf-8" ref={formRef}>
							<input type="hidden" name="merchantAuthType" value="SimpleSignature" /><input type="hidden" name="merchantTransactionSecureType" value="AUTO" /><input type="hidden" name="orderTimeout" value="5" /><input type="hidden" name="clientPhone" value="+380992856055" /><input type="hidden" name="clientEmail" value="some@mail.com" />
							
							<input type="number" defaultValue={1} min="1" name='count' />
							<button type='submit'>Buy spins</button>
						</form>
					
				</DivWithSpinner>
			}
			<Modal open={isModalWithResultOpen} onClose={() => setIsModalWithResultOpen(false)}>
				<div>
					<p>{loading.message}</p> <button onClick={() => setIsModalWithResultOpen(false)}>Ok</button>
				</div>
			</Modal>
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
	receiveTitle: () => dispatch(receiveTitle()) ,
	setTitle: (title) => dispatch(setTitle(title)),
	setPendingTitle: (title) => dispatch(setPendingTitle(title)),
	setCurrentUser: (user) => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReceiveTitlePage)


