import styles from './Post.module.sass'

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import emptyPostImage from '../../../../assets/img/empty-white-letterboard.png'
import baseUrl from '../../../../api/baseUrl'
import { selectCurrentUser, selectUserById } from '../../../../redux/user/user.slice'
import { Link } from 'react-router-dom'
import { likePost, removeLike } from '../../../../redux/post/post.slice'

const Post = ({post: {
	website,
  tags,
  images = [],
  date,
  author, 
  likedBy = [],
	_id
}, currentUser, like, removeLike}) => {
	return (
		<div className={styles.container}>
			<p>website: {website}</p>
			<p>tags: {tags.map((tag, index, array) => index < array.length - 1 ? `${tag}, ` : tag)}</p>
			<p>author: <Link to={`/profile/${author._id}`}>{author.name}</Link></p>
			<p>date: {new Date(date).toDateString()}</p>
			<p>likes: {likedBy.length}</p>
			<img src={images[0] ? `${baseUrl}/image/${images[0]}` : emptyPostImage} alt="post" style={{width: '70px', height: '80px'}}/>

			{
				likedBy.some(id => id == currentUser?._id)
					?
						<button onClick={removeLike}>Remove Like</button>
					:
						<button onClick={like}>Like post</button>
						
			}
			<hr />
		</div>
	)
}

const mapStateToProps = (state, ownProps) => ({
	currentUser: selectCurrentUser(state),
	post: {...ownProps.post, author: selectUserById(ownProps.post.author)(state)}
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	like: () => {console.log(ownProps); return dispatch(likePost(ownProps.post._id))},
	removeLike: () => dispatch(removeLike(ownProps.post._id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Post)


