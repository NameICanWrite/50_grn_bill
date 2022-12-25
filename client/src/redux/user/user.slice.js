import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {createSelector} from 'reselect'
import memoize from "lodash.memoize"
import userApi from '../../api/user.api'
import authApi from '../../api/auth.api'

const initialState = {
    current: {},
    all: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser(state, {payload}) {
            state.current = {...payload} 
            
        },
        setAllUsers(state, {payload}) {
            state.all =[...payload]
        },
        getCurrentUser() {
        },
        getAllUsers() {
        },
        loginWithGoogle() {
        },
        loginWithNameAndPassword() {
        },
        createUserWithNameAndPassword() {
        },
        sendActivationCode() {},
        activateAccountWithCode() {},
        logout() {
        },
        modifyCurrentUser() {
        },
        modifyCurrentUserPassword() {
        },
        modifyCurrentUserName() {
        },
        modifyCurrentUserEmail() {
        },
        modifyCurrentUserAvatar() {
        },

        forgetUserPassword(){
        },
        resetUserPassword(){
        }
    }
})

export default userSlice.reducer
export const {
    setCurrentUser,
    getCurrentUser,
    setAllUsers,
    getAllUsers,
    loginWithNameAndPassword,
    loginWithGoogle,
    createUserWithNameAndPassword,
    logout,
    modifyCurrentUser,
    modifyCurrentUserPassword,
    modifyCurrentUserName,
    modifyCurrentUserEmail,
    modifyCurrentUserAvatar,
    forgetUserPassword,
    resetUserPassword,
    activateAccountWithCode,
    sendActivationCode
} = userSlice.actions

const selectUserSlice = state => state.user
const selectAllUsersWithoutCheckForCurrent = createSelector(selectUserSlice, userSlice => userSlice.all)

export const selectCurrentUser = createSelector(selectUserSlice, userSlice => userSlice.current)
export const selectCurrentUserShouldBeActivated = createSelector(selectCurrentUser, currentUser => currentUser.shouldBeActivated)
export const selectCurrentUserName = createSelector(selectCurrentUser, currentUser => currentUser.name)
export const selectCurrentUserEmail = createSelector(selectCurrentUser, currentUser => currentUser.email)

export const selectAllUsers = createSelector([selectCurrentUser, selectAllUsersWithoutCheckForCurrent], (currentUser, allUsers) => {
    return allUsers.map(user => {
        if (user._id == currentUser._id) user = { ...user, isCurrent: true}
        else user = { ...user, isCurrent: false}

        return user
    })
})

export const selectUserById = memoize((userId) => createSelector(selectAllUsers, (allUsers) => {
    const user = allUsers.find(user => user._id == userId)
    return user
}))
