import styles from './AdminPage.module.sass'

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import axios from 'axios'
import baseUrl from '../../../api/baseUrl'
import { toInteger } from 'lodash'

const AdminPage = () => {
	const [websiteSettings, setWebsiteSettings] = useState(null)
	const onWhitelistFormSubmit = async (e) => {
		e.preventDefault()
		const input = e.target.list.value
		const arr = input.split(/[\s,]+/)
		const res = (await axios.post(`${baseUrl}/settings/add-whitelisted-users`, arr)).data
		setWebsiteSettings(res)
	}
	const onUnlistFormSubmit = async (e) => {
		e.preventDefault()
		const input = e.target.list.value
		const arr = input.split(/[\s,]+/)
		const res = (await axios.post(`${baseUrl}/settings/remove-whitelisted-users`, arr)).data
		setWebsiteSettings(res)
	}

	const onPriceFormSubmit = async (e) => {
		e.preventDefault()
		const input = e.target.price.value
		const price = parseFloat(input)
		const res = (await axios.post(`${baseUrl}/settings/set-spin-price`, {spinPrice: price})).data
		setWebsiteSettings(res)
	}

	

	return (
		<div className={styles.container}>
			<form onSubmit={onWhitelistFormSubmit}>
				<p>Whitelist users</p>
				<input type="text" name="list" placeholder='whitelist' />
				<button type="submit">whitelist</button>
			</form>
			<form onSubmit={onUnlistFormSubmit}>
				<p>Unlist users</p>
				<input type="text" name="list" placeholder='unlist' />
				<button type="submit">unlist</button>
			</form>
			<form onSubmit={onPriceFormSubmit}>
				<p>Unlist users</p>
				<input type="number" name="price" min="0.1" step="0.1" placeholder='price' />
				<button type="submit">Change spin price</button>
			</form>
			<div>
				<h4>whitelisted</h4>
				{
					websiteSettings?.whitelistedUsers.map(username => <p>{username}</p>)
				}
				<hr />
				<h4>received reward</h4>
				{
					websiteSettings?.receivedRewardUsers.map(({name}) => <p>{name}</p>)
				}
				<hr />
				<h4>spin price</h4>
				{
					websiteSettings?.spinPrice
				}
			</div>
		</div>
	)
}

const mapStateToProps = createStructuredSelector({})
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)


