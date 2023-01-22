import styles from './InfoModal.module.sass'

import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Modal } from '@mui/material'
import closeCross from '../../../assets/icons/close-window.png'

const Content = ( {header, onClose, onButtonClick, buttonText, text}) => (
	<div className={styles.wrapper}>
		<img className={styles.closeCross} src={closeCross} alt='close' onClick={onClose} />
		<h2 className={styles.header}>{header}</h2>
		<p className={styles.text}>{text}</p>
		<button onClick={onButtonClick || onClose} className={`${styles.blackSubmit}`}>{
			buttonText || 'Ok'
		}</button>
	</div>
)

const InfoModal = ({ header, open, onClose, onButtonClick, buttonText, text }) => {
	return (
		<Modal open={open} onClose={onClose}>
			<Content { ...{ header, onClose, onButtonClick, buttonText, text} } />
		</Modal>


	)
}

const mapStateToProps = createStructuredSelector({})
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(InfoModal)


