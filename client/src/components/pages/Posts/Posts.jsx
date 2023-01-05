import styles from './Posts.module.sass'

import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectAllPosts } from '../../../redux/post/post.slice'
import Post from './Post/Post'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { selectAuthLoading, setCreatePostLoading } from '../../../redux/loading.slice'
import { Modal } from '@mui/material'
import CreatePostForm from './CreatePostForm/CreatePostForm'
import WithSpinner from '../../layout/WithSpinner/WithSpinner'

const Posts = ({posts, isAuthenticated, setCreatePostLoading}) => {
	useEffect(() => {
		console.log(posts);
	}, [posts])
	const navigate = useNavigate()
	return (
		<div className={styles.container}>
			<button className={styles.createPostButton} onClick={() => navigate('create-post')}>+</button>

			<hr />
			<div className={styles.postsContainer}>
				{
					[...posts]
					// .sort((postA, postB) => {
					// 	const likesA = postA.likedBy.length
					// 	const likesB = postB.likedBy.length

					// 	let res
					// 	if (likesA > likesB) res = -1
					// 	if (likesA < likesB) res = 1
					// 	if (likesA === likesB) res = 0
					// 	console.log(postA.website + '-' + postB.website)
					// 	console.log(res);
					// 	return res

					// })
					.sort((postA, postB) => {
						const dateA = postA.date
						const dateB = postB.date

						let res
						if (new Date(dateA).getTime() > new Date(dateB).getTime()) res = -1
						if (new Date(dateA).getTime() < new Date(dateB).getTime()) res = 1
						
						return res

					})
					
					.map(post =>
						<Post post={post}/>
					)
				}
			</div>
			
			<Routes>
				<Route path={'create-post'} element={
					<Modal open={true} onClose={() => {
						setCreatePostLoading({success: false, message: '', isLoading: false})
						navigate('.')
						}} >
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
const mapDispatchToProps = (dispatch) => ({
	setCreatePostLoading: (loading) => dispatch(setCreatePostLoading(loading)) 
})

export default WithSpinner(connect(mapStateToProps, mapDispatchToProps)(Posts))


