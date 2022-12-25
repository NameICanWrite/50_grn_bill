import {
  call,
  put,
  takeEvery,
  takeLatest,
  select,
  delay
} from '@redux-saga/core/effects'
import withLoading from '../../utils/redux-utils/withLoading.saga'
import { setPostsLoading } from '../loading.slice'
import postsApi from '../../api/posts.api'
import { getAllPosts, likePost, likePostLocally, removeLike, removeLikeLocally, setAllPosts } from './post.slice'
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

export default function* postSaga() {
  yield takeLatest(getAllPosts, fetchPostsSaga)
	yield takeLatest(likePost, likePostSaga)
	yield takeLatest(removeLike, removeLikeSaga)
}