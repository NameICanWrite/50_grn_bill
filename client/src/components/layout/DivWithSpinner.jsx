import React from 'react'
import { connect } from 'react-redux'
import WithSpinner from './WithSpinner/WithSpinner'

const DivWithSpinner = ({children}) => {
	return (
		<div>
			{children}
		</div>
	)
}



export default WithSpinner(DivWithSpinner)
