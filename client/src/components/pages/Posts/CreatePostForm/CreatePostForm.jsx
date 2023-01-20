import styles from './CreatePostForm.module.sass'

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { createPost } from '../../../../redux/post/post.slice';
import DivWithSpinner from '../../../layout/DivWithSpinner'
import { selectCreatePostLoading } from '../../../../redux/loading.slice';
import { FileUploader } from "react-drag-drop-files";
import { useNavigate } from 'react-router-dom';
import closeCross from '../../../../assets/icons/close-window.png'
const postTags = [
	'social media',
	'tech',
	'viral',
	'commerce',
	'giant',
	'disruptive'
]





const CreatePostForm = ({ createPost, loading, onClose }) => {

	const [selectedFile, setSelectedFile] = useState()
	const [preview, setPreview] = useState()
	const [isDefaultImage, setIsDefaultImage] = useState(true)

	useEffect(() => {

	}, [])

	const navigate = useNavigate()

	useEffect(() => {
		if (!selectedFile) {
			setPreview(undefined)
			return
		}
		const objectUrl = URL.createObjectURL(selectedFile)
		setPreview(objectUrl)

		// free memory when ever this component is unmounted
		return () => URL.revokeObjectURL(objectUrl)
	}, [selectedFile])

	// const onSelectFiles = e => {
	// 	console.log(e)
	// 	if (!e.target.files || e.target.files.length === 0) {
	// 		setSelectedFile(undefined)
	// 		return
	// 	}
	// 	setSelectedFile(e.target.files[0])
	// }

	const onSelectFile = file => {
		if (!file) {
			setSelectedFile(undefined)
			return
		}
		setSelectedFile(file)
	}

	return (
		<div className={styles.container}>
			<img className={styles.closeCross} src={closeCross} alt='close' onClick={onClose}/>
			<DivWithSpinner isLoading={loading.isLoading} spinnerContainerClassName={styles.spinnerContainer}>
				{
					!loading.message
						?
							<>
								<form className={`${styles.form} ${!isDefaultImage ? styles.withPreview : ''}`} onSubmit={(event) => {
									event.preventDefault()
									const website = event.target.website.value
									// const tags = postTags.filter(tag => event.target[`${tag}Tag`].checked == true)
									createPost({
										website,
										// tags,
										image: selectedFile
									})
								}}>
									<p className={styles.header}>Дайте посилання на улюблений сайт</p>
									{
										(!isDefaultImage && preview) && 
											<img src={preview} className={styles.preview} alt="preview" />
									}
									{
										(!isDefaultImage && !preview) &&
										<p className={styles.noFileSelected}>Виберіть файл</p>
									}								
									{!isDefaultImage && <FileUploader
										handleChange={onSelectFile}
										name="image"
										// types={fileTypes}
										classes={styles.imageInput}
										accept="image/*"
									/>}
									<input type="text" name="website" placeholder='Посилання на сторінку' />
									<label className={styles.getImageAuthomaticallyCheckbox}>
										<input key='is-default-image-checkbox' type='checkbox' name='isDefaultImage' defaultChecked={isDefaultImage} onChange={(event) => setIsDefaultImage(event.target.checked)} />
										<span>Отримати картинку автоматично</span>
									</label>
									<button type='submit' className={`${styles.blackSubmit} ${(!isDefaultImage && !selectedFile) ? styles.disabled : ''}`} disabled={!isDefaultImage && !selectedFile}>Create post</button>
								</form>
								<p>{loading.message}</p>
								
							</>
						:
							<>
								{
									loading.success
									?
										<>
											<p  className={`${styles.message} ${styles.success}`}>
												{loading.message}
											</p>
											<button className={`${styles.blackSubmit} ${styles.small}`} onClick={onClose}>OK</button>
										</>
									:
										<>
											<p className={`${styles.message} ${styles.error}`}>
												{loading.message}
											</p>
											<button className={`${styles.blackSubmit} ${styles.small}`} onClick={onClose}>OK</button>
										</>
								}
							</>

				}
			</DivWithSpinner>
		</div>

	)
}

const mapStateToProps = createStructuredSelector({
	loading: selectCreatePostLoading
})
const mapDispatchToProps = (dispatch) => ({
	createPost: (payload) => dispatch(createPost(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostForm)


