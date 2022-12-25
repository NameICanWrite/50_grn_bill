import styles from './CreatePostForm.module.sass'

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

const postTags = [
	'social media',
	'tech',
	'viral',
	'commerce',
	'giant',
	'disruptive'
]





const CreatePostForm = () => {

	const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()

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

	return (
		<div className={styles.container}>
			<img src={preview} alt="preview" />
			<form onSubmit={() => {}}>
				<input type="text" name="website" onChange={() => {
				}}/>
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
		</div>
	)
}

const mapStateToProps = createStructuredSelector({})
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostForm)


