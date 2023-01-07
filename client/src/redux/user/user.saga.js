import {
    call,
    put,
    takeLatest,
} from '@redux-saga/core/effects'
import authApi from '../../api/auth.api'
import titleApi from '../../api/title.api'
import userApi from '../../api/user.api'
import withLoading from '../../utils/redux-utils/withLoading.saga'
import {
    setAuthLoading,
    setFetchCurrentUserLoading,
    setAuthLoadingSilently,
    setModifyCurrentUserPasswordLoading,
    setForgetUserPasswordLoading, 
    setResetUserPasswordLoading, 
    selectAllUsersLoading, 
    setFetchAllUsersLoading,
    setPostsLoading,
    setModifyCurrentUserNameLoading,
    setModifyCurrentUserEmailLoading,
    setModifyCurrentUserAvatarLoading,
    setSendActivationCodeLoading,
    setReceiveTitleLoading
} from '../loading.slice'
import {
    createUserWithNameAndPassword,
    getCurrentUser,
    loginWithNameAndPassword,
    loginWithGoogle,
    logout,
    setCurrentUser,
    modifyCurrentUserPassword,
    forgetUserPassword,
    resetUserPassword,
    selectAllUsers,
    getAllUsers,
    setAllUsers,
    modifyCurrentUserEmail,
    modifyCurrentUserName,
    modifyCurrentUserAvatar,
    sendActivationCode,
    activateAccountWithCode,
    setPendingTitle,
    decreaseSpins,
    receiveTitle
} from './user.slice'


export const getCurrentUserSaga = withLoading(function* () {
    const currentUser = yield userApi.getSingle('one/current')
    yield put(setCurrentUser(currentUser))
    yield console.log('current user');
    yield console.log(currentUser);
    return currentUser.message
}, setFetchCurrentUserLoading, setAuthLoadingSilently)


const handleAuth = withLoading(function* (auth) {
    const authMessage = yield call(auth)
    yield call(getCurrentUserSaga)

    return authMessage
}, setAuthLoading)

function* loginWithGoogleSaga({payload}) {
    yield call(handleAuth, async () => await authApi.postSingle('login-with-google', payload))
}

function* loginWithNameAndPasswordSaga({payload}) {
    
    yield call(handleAuth, async () => await authApi.postSingle('login', payload))
}

function* createUserWithNameAndPasswordSaga({payload}) {
    yield call(handleAuth, async () => await authApi.postSingle('create-inactive-user', payload))
}

const sendActivationCodeSaga = withLoading(function* () {
    const message = yield authApi.postSingle('send-activation-code')
    return message
}, setSendActivationCodeLoading)

const activateAccountWithCodeSaga = withLoading(function* ({payload}) {
    const message = yield authApi.postSingle('activate-user-with-code', {code: payload})
    yield call(getCurrentUserSaga)
    return message
}, setAuthLoading)

const logoutSaga = withLoading(function* () {
    const authMessage = yield authApi.postSingle('logout')
    yield put(setCurrentUser(null))
    yield put(setAuthLoading({success: false, isLoading: false, message: ''}))

    return authMessage
}, setFetchCurrentUserLoading)

const fetchAllUsersSaga = withLoading(function* () {
    const users = yield userApi.getSingle('all')
    yield console.log(users);
    yield put(setAllUsers(users))
}, setFetchAllUsersLoading)





// const modifyCurrentUserSaga = withLoading(function* ({payload: {
//     name, email, password
// }}) {
//     let message
//     if (name) {
//         message = yield authApi.postSingle('set/name', {name})
//     }
//     if (email) {
//         message = yield authApi.postSingle('set/email', {email})
//     }
//     if (password) {
//         message = yield authApi.postSingle('set/password', {password})
//     }

//     yield call(getCurrentUserSaga)
//     return message
// }, setModifyCurrentUserLoading)

const modifyCurrentUserPasswordSaga= withLoading( function* ({payload}){
    const message= yield authApi.postSingle('set-password', payload)
    yield call(getCurrentUserSaga)
    yield call(fetchAllUsersSaga)
    return message
}, setModifyCurrentUserPasswordLoading)

const modifyCurrentUserNameSaga= withLoading( function* ({payload}){
    const message = yield authApi.postSingle('set-name', payload)
    yield console.log(message);
    yield call(getCurrentUserSaga)
    yield call(fetchAllUsersSaga)
    return message
}, setModifyCurrentUserNameLoading)

const modifyCurrentUserEmailSaga= withLoading( function* ({payload}){
    const message= yield authApi.postSingle('set-email', payload)
    yield call(getCurrentUserSaga)
    yield call(fetchAllUsersSaga)
    return message
}, setModifyCurrentUserEmailLoading)

export const modifyCurrentUserAvatarSaga = withLoading(function* ({payload}) {
    let formData = new FormData();
    formData.append('avatar', payload)
    const message = yield userApi.postSingle('set-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    yield call(getCurrentUserSaga)
    yield call(fetchAllUsersSaga)

    return message
}, setModifyCurrentUserAvatarLoading) 

export const receiveTitleSaga = withLoading(function* ({payload}) {
    yield put(decreaseSpins())
    const {message, title} = yield titleApi.getSingle('/receive-random-title')

    yield put(setPendingTitle(title))

    return message
}, setReceiveTitleLoading)


const forgetUserPasswordSaga= withLoading( function* ({payload}){
    const message= yield userApi.postSingle('forgot-password', payload)
    yield call(getCurrentUserSaga)
    return message
}, setForgetUserPasswordLoading)

const resetUserPasswordSaga= withLoading( function* ({payload}){
    console.log('inside reset pass saga')
    const message= yield userApi.postSingle(`reset-password/${payload.token}`, payload)
    yield call(getCurrentUserSaga)
    return message
}, setResetUserPasswordLoading)



export default function* userSaga() {
    yield takeLatest(loginWithGoogle, loginWithGoogleSaga)
    yield takeLatest(loginWithNameAndPassword, loginWithNameAndPasswordSaga)

    yield takeLatest(createUserWithNameAndPassword, createUserWithNameAndPasswordSaga)
    yield takeLatest(sendActivationCode, sendActivationCodeSaga)
    yield takeLatest(activateAccountWithCode, activateAccountWithCodeSaga)

    yield takeLatest(logout, logoutSaga)

    yield takeLatest(getCurrentUser, getCurrentUserSaga)
    yield takeLatest(getAllUsers, fetchAllUsersSaga)

    yield takeLatest(modifyCurrentUserPassword, modifyCurrentUserPasswordSaga)
    yield takeLatest(modifyCurrentUserName, modifyCurrentUserNameSaga)
    yield takeLatest(modifyCurrentUserEmail, modifyCurrentUserEmailSaga)
    yield takeLatest(modifyCurrentUserAvatar, modifyCurrentUserAvatarSaga)

    yield takeLatest(forgetUserPassword, forgetUserPasswordSaga)
    yield takeLatest(resetUserPassword, resetUserPasswordSaga)

    yield takeLatest(receiveTitle, receiveTitleSaga)
    
}


