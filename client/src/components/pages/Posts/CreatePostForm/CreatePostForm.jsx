import styles from './CreatePostForm.module.sass'

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { createPost } from '../../../../redux/post/post.slice';
import DivWithSpinner from '../../../layout/DivWithSpinner'
import { selectCreatePostLoading } from '../../../../redux/loading.slice';

const postTags = [
	'social media',
	'tech',
	'viral',
	'commerce',
	'giant',
	'disruptive'
]





const CreatePostForm = ({createPost, loading}) => {

	const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()
	const [isDefaultImage, setIsDefaultImage] = useState(true)

  useEffect(() => {

  }, [])


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

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    setSelectedFile(e.target.files[0])
  }

	return (
		<DivWithSpinner className={styles.container} isLoading={loading.isLoading}>
			{preview && <img src={preview} alt="preview" style={{ height: '20px', width: '20px' }} />}
			<form onSubmit={(event) => {
				const website = event.target.website.value
				const tags = postTags.filter(tag => event.target[`${tag}Tag`].checked == true)
				createPost({
					website,
					tags,
					image: selectedFile
				})
			}}>
        {!isDefaultImage && <input
          name='image'
          type={'file'}
          onChange={onSelectFile}
        />}
				<input type="text" name="website" />
				<input type='checkbox' name='isDefaultImage' defaultChecked={true} onChange={(event) => setIsDefaultImage(event.target.checked)}/>
				<label htmlFor="isDefaultImage">is default image</label>
				{
					postTags.map((tag, index) => 
						<>
							<input type="checkbox" name={`${tag}Tag`} id={index} />
							<label htmlFor={`${tag}Tag`}>{tag}</label>
						</>	
					)
				}
				<button type='submit'>Create post</button>
			</form>
			<p>{loading.message}</p>
		</DivWithSpinner>
	)
}

const mapStateToProps = createStructuredSelector({
	loading: selectCreatePostLoading
})
const mapDispatchToProps = (dispatch) => ({
	createPost: (payload) => dispatch(createPost(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostForm)


