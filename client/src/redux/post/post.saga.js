import {
  call,
  put,
  takeEvery,
  takeLatest,
  select,
  delay
} from '@redux-saga/core/effects'
import withLoading from '../../utils/redux-utils/withLoading.saga'
import { setCreatePostLoading, setPostsLoading } from '../loading.slice'
import postsApi from '../../api/posts.api'
import { addPost, createPost, getAllPosts, likePost, likePostLocally, removeLike, removeLikeLocally, setAllPosts } from './post.slice'
import { selectCurrentUser } from '../user/user.slice'


const fetchPostsSaga = withLoading(function* () {
  const posts = yield postsApi.getSingle('all')
  yield put(setAllPosts(posts))
}, setPostsLoading)

const likePostSaga = withLoading(function* ({payload}) {
  const currentUser = yield select(selectCurrentUser)
  const postId = payload
  yield put(likePostLocally({currentUserId: currentUser._id, postId}))
  yield postsApi.getSingle(`one/${postId}/like`)
})

const removeLikeSaga = withLoading(function* ({payload}) {
  const currentUser = yield select(selectCurrentUser)
  const postId = payload
  yield put(removeLikeLocally({currentUserId: currentUser._id, postId}))
  yield postsApi.getSingle(`one/${postId}/remove-like`)
})



export const createPostSaga = withLoading(function* ({payload: {image, website, tags}}) {
  let createPostResponse, createdPost
  if (image) {
    createPostResponse = yield postsApi.postSingle('create-post', {website, tags, isImageNeeded: false})
    createdPost = createPostResponse.post
    yield console.log(createPostResponse);

    let formData = new FormData();
    formData.append('postImage', image)
    yield postsApi.postSingle(`one/${createdPost._id}/add-image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    createdPost = yield postsApi.getSingle('one/' + createdPost._id)
    

  } else {
    createPostResponse = yield postsApi.postSingle('create-post', {website, tags, isImageNeeded: true})
    createdPost = createPostResponse.post
  }
  
  yield put(addPost(createdPost))

  let message = createPostResponse.message
  return message
}, setCreatePostLoading) 



export default function* postSaga() {
  yield takeLatest(getAllPosts, fetchPostsSaga)
	yield takeLatest(likePost, likePostSaga)
	yield takeLatest(removeLike, removeLikeSaga)
  yield takeLatest(createPost, createPostSaga)
}