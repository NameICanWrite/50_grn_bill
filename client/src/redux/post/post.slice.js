import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'


const initialState = {
  all: []
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
		setAllPosts(state, {payload}) {
			state.all = payload
		},
    getAllPosts() {
    },
    likePostLocally(state, {payload: {currentUserId, postId}}) {
      state.all = state.all.map(post => {
        
        if (post._id == postId) {
          if (!post.likedBy.some(id => id ==currentUserId)) {
            post.likedBy = [...post.likedBy, currentUserId]
          }
        }
        return post
      })
    },
    removeLikeLocally(state, {payload: {currentUserId, postId}}) {      
      state.all = state.all.map(post => {
        if (post._id == postId) {
          if (post.likedBy.some(id => id ==currentUserId)) {
            post.likedBy = post.likedBy.filter(id => id != currentUserId)
          }
        }
        return post
      })
    },
    likePost() {},
    removeLike() {},
    createPost() {
    } 
  }
})

export default postSlice.reducer
export const {
  setAllPosts,
  getAllPosts,
  likePost,
  createPost,
  likePostLocally,
  removeLikeLocally,
  removeLike
} = postSlice.actions

export const selectPostSlice = state => state.post
export const selectAllPosts = createSelector(selectPostSlice, (postSlice) => postSlice.all)