import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {createSelector} from 'reselect'
import userApi from '../api/user.api'
import authApi from '../api/auth.api'


const initialState = {
    user: {
        current: {
            success: false,
            isLoading: true,
            message: '',
        },
        auth: {
            success: false,
            isLoading: true,
            message: '',
        },
        sendActivationCode: {
            success: false,
            isLoading: false,
            message: '',
        },
        modifyPassword: {
            success: false,
            isLoading: false,
            message: ''
        },
        modifyEmail: {
            success: false,
            isLoading: false,
            message: ''
        },
        modifyName: {
            success: false,
            isLoading: false,
            message: ''
        },
        modifyAvatar: {
            success: false,
            isLoading: false,
            message: ''
        },
        all: {
            success: false,
            isLoading: false,
            message: ''
        }
    },
    posts: {
        success: false,
        isLoading: false,
        message: ''
    }

}

const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        removeModifyLoadingMessages(state) {
            state.user.modifyName = {...state.user.modifyName, message: ''}
            state.user.modifyEmail = {...state.user.modifyEmail, message: ''}
            state.user.modifyPassword = {...state.user.modifyPassword, message: ''}
            state.user.modifyAvatar = {...state.user.modifyAvatar, message: ''}
        },
        setFetchCurrentUserLoading(state, {payload}) {
            state.user.current = payload
        },
        setSendActivationCodeLoading(state, {payload}) {
            state.user.sendActivationCode = payload
        },
        // setModifyCurrentUserLoading(state, {payload}) {
        //     state.user.modify=payload
        // },
        setModifyCurrentUserPasswordLoading(state, {payload}) {
            state.user.modifyPassword=payload
        },
        setModifyCurrentUserEmailLoading(state, {payload}) {
            state.user.modifyEmail=payload
        },
        setModifyCurrentUserNameLoading(state, {payload}) {
            state.user.modifyName=payload
        },
        setModifyCurrentUserAvatarLoading(state, {payload}) {
            state.user.modifyAvatar=payload
        },

       
        setAuthLoading(state, {payload}) {
            state.user.auth = payload
        },
        setAuthLoadingSilently(state, { payload }) {
            payload.message = ''
            state.user.auth = payload
        },
        setFetchAllUsersLoading(state, {payload}) {
            state.user.all = payload
        },
        setPostsLoading(state, {payload}) {
            state.posts = payload
        },
        setForgetUserPasswordLoading(state, {payload}) {
            state.user.modify=payload
        },
        setResetUserPasswordLoading(state, {payload}) {
            state.user.modify=payload
        },
    }
})

export default loadingSlice.reducer
export const {
    setFetchCurrentUserLoading,
    setAuthLoading,
    setAuthLoadingSilently,
    setModifyCurrentUserPasswordLoading,
    setModifyCurrentUserEmailLoading,
    setModifyCurrentUserNameLoading,
    setModifyCurrentUserAvatarLoading,
    setForgetUserPasswordLoading,
    setResetUserPasswordLoading,
    setFetchAllUsersLoading,
    setPostsLoading,
    setSendActivationCodeLoading,
    removeModifyLoadingMessages

} = loadingSlice.actions

export const selectLoading = state => state.loading

export const selectUserLoading = createSelector(selectLoading, (loading) => loading.user)
export const selectSendActivationCodeLoading = createSelector(selectUserLoading, (userLoading) => userLoading.sendActivationCode)
export const selectCurrentUserLoading = createSelector(selectUserLoading, (userLoading) => userLoading.current)
export const selectAuthLoading = createSelector(selectUserLoading, (userLoading) => userLoading.auth)
export const selectModifyCurrentUserLoading = createSelector(selectUserLoading, (userLoading) => userLoading.modify)
export const selectModifyCurrentUserPasswordLoading= createSelector(selectUserLoading, (userLoading) => {
    return userLoading.modifyPassword})
export const selectModifyCurrentUserEmailLoading = createSelector(selectUserLoading, (userLoading) => userLoading.modifyEmail)
export const selectModifyCurrentUserNameLoading = createSelector(selectUserLoading, (userLoading) => {
    return userLoading.modifyName})
export const selectModifyCurrentUserAvatarLoading = createSelector(selectUserLoading, (userLoading) => userLoading.modifyAvatar)


export const selectForgetUserPasswordLoading= createSelector(selectUserLoading, (userLoading) => userLoading.modify)
export const selectResetUserPasswordLoading= createSelector(selectUserLoading, (userLoading) => userLoading.modify)
export const selectAllUsersLoading = createSelector(selectUserLoading, userLoading => userLoading.all)

