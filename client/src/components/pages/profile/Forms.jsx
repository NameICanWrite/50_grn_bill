import { useEffect, useState } from "react"
import { selectUserById } from "../../../redux/user/user.slice"
import WithSpinner from "../../layout/WithSpinner/WithSpinner"
import { createStructuredSelector } from "reselect";
import { forgetUserPassword, selectCurrentUser, modifyCurrentUser, modifyCurrentUserPassword, modifyCurrentUserEmail, modifyCurrentUserName, modifyCurrentUserAvatar } from "../../../redux/user/user.slice";
import { selectModifyCurrentUserAvatarLoading, selectModifyCurrentUserEmailLoading, selectModifyCurrentUserNameLoading, selectModifyCurrentUserPasswordLoading } from '../../../redux/loading.slice'
import { connect } from "react-redux";

import { Modal, Box, Typography } from '@mui/material'

import styles from './Profile.module.sass'
import emptyAvatar from '../../../assets/img/empty-avatar.jpg'
import baseUrl from "../../../api/baseUrl";
import DivWithSpinner from "../../layout/DivWithSpinner";


function EditNameFormFunction({ name, modifyCurrentUserName, modifyCurrentUserNameLoading }) {
  useEffect(() => {

  }, [])

  const onSubmit = event => {
    event.preventDefault()
    modifyCurrentUserName({ name: event.target.newName.value })
  }
  return (
    <DivWithSpinner isLoading={modifyCurrentUserNameLoading.isLoading}>
      <form onSubmit={onSubmit}>
        <input
          name={'newName'}
          type={'text'}
        />
        <button type={'submit'}>Change name</button>
        <p>{modifyCurrentUserNameLoading.message}</p>
      </form>
    </DivWithSpinner>

  )
}



function EditEmailFormFunction({ email, modifyCurrentUserEmail, modifyCurrentUserEmailLoading }) {
  useEffect(() => {

  }, [])

  const onSubmit = event => {
    event.preventDefault()
    modifyCurrentUserEmail({ email: event.target.newEmail })
  }

  return (
    <DivWithSpinner isLoading={modifyCurrentUserEmail.isLoading}>
      <form onSubmit={onSubmit}>
        <input
          name={'newEmail'}
          type={'text'}
        />
        <button type={'submit'}>Change email</button>
        <p>{modifyCurrentUserEmailLoading.message}</p>
      </form>
    </DivWithSpinner>

  )
}

function EditPasswordFormFunction({ modifyCurrentUserPassword, modifyCurrentUserPasswordLoading }) {
  useEffect(() => {

  }, [])

  const onSubmit = event => {
    event.preventDefault()
    modifyCurrentUserPassword({ password: event.target.newPassword })
  }
  return (
    <DivWithSpinner isLoading={modifyCurrentUserPasswordLoading.isLoading}>
      <form onSubmit={onSubmit}>
        <input
          name={'newPassword'}
          type={'text'}
        />
        <button type={'submit'}>Change password</button>
        <p>{modifyCurrentUserPasswordLoading.message}</p>
      </form>
    </DivWithSpinner>

  )
}

function EditAvatarFormFunction({ modifyCurrentUserAvatar, modifyCurrentUserAvatarLoading }) {
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()

  useEffect(() => {

  }, [])


  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    setSelectedFile(e.target.files[0])
  }

  useEffect(() => { console.log(modifyCurrentUserAvatarLoading) }, [modifyCurrentUserAvatarLoading])

  const onSubmit = event => {
    event.preventDefault()
    if (selectedFile) {
      console.log(selectedFile);
      modifyCurrentUserAvatar(selectedFile)
    }
  }

  return (
    <DivWithSpinner isLoading={modifyCurrentUserAvatarLoading.isLoading}>
      <form onSubmit={onSubmit}>
        {preview && <img src={preview} alt="preview" style={{ height: '20px', width: '20px' }} />}
        <input
          name='newAvatar'
          type={'file'}
          onChange={onSelectFile}
        />
        <button type={'submit'}>Change avatar</button>
        <p>{modifyCurrentUserAvatarLoading.message}</p>
      </form>
    </DivWithSpinner>

  )

}


const mapStateToProps = (state, ownProps) => ({
  modifyCurrentUserNameLoading: selectModifyCurrentUserNameLoading(state),
  modifyCurrentUserPasswordLoading: selectModifyCurrentUserPasswordLoading(state),
  modifyCurrentUserEmailLoading: selectModifyCurrentUserEmailLoading(state),
  modifyCurrentUserAvatarLoading: selectModifyCurrentUserAvatarLoading(state),
  name: selectCurrentUser(state).name,
  email: selectCurrentUser(state).email
})

const mapDispatchToProps = dispatch => ({
  modifyCurrentUserName: data => dispatch(modifyCurrentUserName(data)),
  modifyCurrentUserEmail: data => dispatch(modifyCurrentUserEmail(data)),
  modifyCurrentUserPassword: data => dispatch(modifyCurrentUserPassword(data)),
  modifyCurrentUserAvatar: avatar => dispatch(modifyCurrentUserAvatar(avatar)),
})

export const EditNameForm = connect(mapStateToProps, mapDispatchToProps)(EditNameFormFunction)
export const EditEmailForm = connect(mapStateToProps, mapDispatchToProps)(EditEmailFormFunction)
export const EditPasswordForm = connect(mapStateToProps, mapDispatchToProps)(EditPasswordFormFunction)
export const EditAvatarForm = connect(mapStateToProps, mapDispatchToProps)(EditAvatarFormFunction)