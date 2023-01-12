import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'


const initialState = {
  showEditUserName: false,
  showEditUserPassword: false,
  showEditUserEmail: false,
  showEditUserAvatar: false,
  showNavHamburger: false
}

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
		setShowEditUserName(state, {payload}) {
			state.showEditUserName = payload
		},
		setShowEditUserPassword(state, {payload}) {
			state.showEditUserPassword = payload
		},
		setShowEditUserEmail(state, {payload}) {
			state.showEditUserEmail = payload
		},
		setShowEditUserAvatar(state, {payload}) {
			state.showEditUserAvatar = payload
		},
    setShowNavHamburger(state, {payload}) {
      state.showNavHamburger = payload
    }
  }
})

export default modalsSlice.reducer
export const {
  setShowNavHamburger,
  setShowEditUserAvatar,
  setShowEditUserEmail,
  setShowEditUserName,
  setShowEditUserPassword
} = modalsSlice.actions

export const selectShowEditUserName = state => state.modals.showEditUserName
export const selectShowEditUserEmail = state => state.modals.showEditUserEmail
export const selectShowEditUserAvatar = state => state.modals.showEditUserAvatar
export const selectShowEditUserPassword = state => state.modals.showEditUserPassword
export const selectShowNavHamburger = state => state.modals.showNavHamburger