import styles from './Post.module.sass'

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import emptyPostImage from '../../../../assets/img/empty-white-letterboard.png'
import baseUrl from '../../../../api/baseUrl'
import { selectCurrentUser, selectUserById } from '../../../../redux/user/user.slice'
import { Link } from 'react-router-dom'
import { likePost, removeLike } from '../../../../redux/post/post.slice'
import emptyAvatar from '../../../../assets/img/empty-avatar.jpg'

const Post = ({ post: {
	website,
	tags,
	linkPreview: {
		title,
		siteName,
		description,
		imageUrl,
		screenshotFileId,
	} = {},
	date,
	author,
	likedBy = [],
	_id
}, currentUser, like, removeLike }) => {
	//to short text if too long
	const descriptionLimit = 100
	const urlLimit = 30
	const newTabWithPostWebsite = () => {
		window.open(website)
	}
	return (
		<div className={styles.container}>
			<Link to={`/profile/${author._id}`}>
				<div className={styles.top}>
					<img src={author.avatar ? `${baseUrl}/image/${author.avatar}` : emptyAvatar} alt="avatar" className={styles.avatar} />
					<div className={styles.rightText}>
						<div className={styles.authorName}>{author.name}</div>
						<div className={styles.authorTitle}>{author.title}</div>
					</div>

					<div className={styles.dateCreated}>{new Date(date).toLocaleDateString()}</div>
				</div>
			</Link>
			
			<div className={styles.textBlock}>
				{/* metadata can contain some html syntax */}
				<div className={styles.siteName} dangerouslySetInnerHTML={{ __html: siteName || '' }}></div>
				<div className={styles.title} dangerouslySetInnerHTML={{ __html: title || '' }}></div>
				<div className={styles.description} dangerouslySetInnerHTML={{ __html: description ? (description?.length <= descriptionLimit ? description : description?.substring(0, descriptionLimit) + '...') : '' } }></div>
			</div>

			<img
				onClick={newTabWithPostWebsite}
				src={imageUrl || (screenshotFileId && `${baseUrl}/image/${screenshotFileId}`) || emptyPostImage} alt="post"
				className={styles.postImage}
			/>



			{/* <p>tags: {tags.map((tag, index, array) => index < array.length - 1 ? `${tag}, ` : tag)}</p> */}
			<div 
				className={styles.websiteUrlContainer} 
				onClick={newTabWithPostWebsite}
			>
				<div className={styles.websiteUrl}>{website.length <= urlLimit ? website : website?.substring(0, urlLimit) + '...'}</div>
				<hr />
			</div>
			<div className={styles.likesContainer}>
				
				<i
					className={`${styles.likeButton} ${likedBy.some(id => id == currentUser?._id) ? styles.liked : ''}`}
					onClick={() => {
						if (likedBy.some(id => id == currentUser?._id)) {
							removeLike()
						} else {
							like()
						}
					}}
				></i>
				<p className={styles.likeCount}>{likedBy.length}</p>
				{/* <span className={likedBy.some(id => id == currentUser?._id) ? styles.liked : ''}>Liked!</span> */}
			</div>
		</div>
	)
}

const mapStateToProps = (state, ownProps) => ({
	currentUser: selectCurrentUser(state),
	post: { ...ownProps.post, author: selectUserById(ownProps.post.author)(state) }
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	like: () => { console.log(ownProps); return dispatch(likePost(ownProps.post._id)) },
	removeLike: () => dispatch(removeLike(ownProps.post._id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Post)


