import styles from './Posts.module.sass'

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectAllPosts } from '../../../redux/post/post.slice'
import Post from './Post/Post'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { selectAuthLoading } from '../../../redux/loading.slice'
import { Modal } from '@mui/material'
import CreatePostForm from './CreatePostForm/CreatePostForm'

const Posts = ({posts, isAuthenticated}) => {
	useEffect(() => {
		console.log(posts);
	}, [posts])
	const navigate = useNavigate()
	return (
		<div className={styles.container}>
			<button onClick={() => navigate('create-post')}>Create post</button>

			<hr />
			{
				posts.map(post =>
					<Post post={post}/>
				)
			}
			<Routes>
				<Route path={'create-post'} element={
					<Modal open={true} onClose={() => navigate('.')} >
						<CreatePostForm />
					</Modal>
				}>
				</Route>
			</Routes>
		</div>
	)
}

const mapStateToProps = (state) => ({
	posts: selectAllPosts(state),
	isAuthenticated: selectAuthLoading(state).success
})
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Posts)


