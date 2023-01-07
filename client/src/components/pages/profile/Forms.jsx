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
import closeCross from '../../../assets/icons/close-window.png'
import Cleave from "cleave.js/react";
import { FileUploader } from "react-drag-drop-files";


function EditNameFormFunction({ name, modifyCurrentUserName, modifyCurrentUserNameLoading, onClose, className }) {
  useEffect(() => {

  }, [])

  const onSubmit = event => {
    event.preventDefault()
    modifyCurrentUserName({ name: event.target.newName.value })
  }
  return (
    <div className={styles.editFormWrapper}>
      <img className={styles.closeCross} src={closeCross} onClick={onClose} />
      <DivWithSpinner isLoading={modifyCurrentUserNameLoading.isLoading} spinnerContainerClassName={styles.spinnerContainer}>
        {
          !modifyCurrentUserNameLoading.message || !modifyCurrentUserNameLoading.success
            ?
            <>
              <form onSubmit={onSubmit} className={className}>
                <input
                  name={'newName'}
                  type={'text'}
                />
                {modifyCurrentUserNameLoading.message && <p>{modifyCurrentUserNameLoading.message}</p>}
                <button className={styles.blackSubmit} type={'submit'}>Change name</button>
                
              </form>
            </>
            :
            <>
              {
                modifyCurrentUserNameLoading.success
                  ?
                  <>
                    <p className={`${styles.message} ${styles.success}`}>
                      {modifyCurrentUserNameLoading.message}
                    </p>
                    <button className={`${styles.blackSubmit} ${styles.small}`} onClick={onClose}>OK</button>
                  </>
                  :
                  <>
                    <p className={`${styles.message} ${styles.error}`}>
                      {modifyCurrentUserNameLoading.message}
                    </p>
                    <button className={`${styles.blackSubmit} ${styles.small}`} onClick={onClose}>OK</button>
                  </>
              }
            </>

        }
      </DivWithSpinner>
    </div>


  )
}



function EditEmailFormFunction({ email, modifyCurrentUserEmail, modifyCurrentUserEmailLoading, onClose, className }) {
  useEffect(() => {

  }, [])

  const onSubmit = event => {
    event.preventDefault()
    modifyCurrentUserEmail({ email: event.target.newEmail.value })
  }

  return (
    <div className={styles.editFormWrapper}>
      <img className={styles.closeCross} src={closeCross} onClick={onClose} />
      <DivWithSpinner isLoading={modifyCurrentUserEmailLoading.isLoading} spinnerContainerClassName={styles.spinnerContainer}>

        {
          !modifyCurrentUserEmailLoading.message
            ?
            <>
              <form onSubmit={onSubmit} className={className}>
                <input
                  name={'newEmail'}
                  type={'text'}
                />
                <button className={styles.blackSubmit} type={'submit'}>Change email</button>
                <p>{modifyCurrentUserEmailLoading.message}</p>
              </form>
            </>
            :
            <>
              {
                modifyCurrentUserEmailLoading.success
                  ?
                  <>
                    <p  className={`${styles.message} ${styles.success}`}>
                      {modifyCurrentUserEmailLoading.message}
                    </p>
                    <button className={`${styles.blackSubmit} ${styles.small}`} onClick={onClose}>OK</button>
                  </>
                  :
                  <>
                    <p className={`${styles.message} ${styles.error}`}>
                      {modifyCurrentUserEmailLoading.message}
                    </p>
                    <button className={`${styles.blackSubmit} ${styles.small}`} onClick={onClose}>OK</button>
                  </>
              }
            </>

        }
      </DivWithSpinner>
    </div>


  )
}

function EditPasswordFormFunction({ modifyCurrentUserPassword, modifyCurrentUserPasswordLoading, onClose, className }) {
  useEffect(() => {

  }, [])

  const onSubmit = event => {
    event.preventDefault()
    modifyCurrentUserPassword({ password: event.target.newPassword.value })
  }
  return (
    <div className={styles.editFormWrapper}>
      <img className={styles.closeCross} src={closeCross} onClick={onClose} />
      <DivWithSpinner isLoading={modifyCurrentUserPasswordLoading.isLoading} spinnerContainerClassName={styles.spinnerContainer}>

        {
          !modifyCurrentUserPasswordLoading.message
            ?
            <>
              <form onSubmit={onSubmit} className={className}>
                <input
                  name={'newPassword'}
                  type={'text'}
                />
                <button className={styles.blackSubmit} type={'submit'}>Change password</button>
                <p>{modifyCurrentUserPasswordLoading.message}</p>
              </form>
            </>
            :
            <>
              {
                modifyCurrentUserPasswordLoading.success
                  ?
                  <>
                    <p  className={`${styles.message} ${styles.success}`}>
                      {modifyCurrentUserPasswordLoading.message}
                    </p>
                    <button onClick={onClose} className={`${styles.blackSubmit} ${styles.small}`}>OK</button>
                  </>
                  :
                  <>
                    <p className={`${styles.message} ${styles.error}`}>
                      {modifyCurrentUserPasswordLoading.message}
                    </p>
                    <button onClick={onClose} className={`${styles.blackSubmit} ${styles.small}`}>OK</button>
                  </>
              }
            </>

        }
      </DivWithSpinner>
    </div>


  )
}

function EditAvatarFormFunction({ modifyCurrentUserAvatar, modifyCurrentUserAvatarLoading, onClose, className, avatar }) {
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

  const onSelectFile = file => {
    if (!file) {
      setSelectedFile(undefined)
      return
    }
    console.log(file)
    setSelectedFile(file)
  }

  const onSubmit = event => {
    event.preventDefault()
    if (selectedFile) {
      console.log(selectedFile);
      modifyCurrentUserAvatar(selectedFile)
    }
  }

  return (
    <div className={styles.editFormWrapper}>
      <img className={styles.closeCross} src={closeCross} onClick={onClose} />
      <DivWithSpinner isLoading={modifyCurrentUserAvatarLoading.isLoading} spinnerContainerClassName={styles.spinnerContainer}>
        {
          !modifyCurrentUserAvatarLoading.message
            ?
            <>

              <form onSubmit={onSubmit} className={className}>
                {
                  preview 
                    ?
                      <img src={preview} alt="preview" className={styles.avatarPreview} />
                    :
                      <p className={styles.noFileSelected}>No file selected</p>
                }
                
                <div>
                  <FileUploader
                    name='newAvatar'
                    handleChange={onSelectFile}
                    accept="image/*"
                    classes={styles.avatarInput}
                  />
                  <button className={`${styles.blackSubmit} ${!selectedFile ? styles.disabled : ''}`} type={'submit'} disabled={!selectedFile}>Change avatar</button>
                  <p className={styles.message}>{modifyCurrentUserAvatarLoading.message}</p>

                </div>
              </form>
            </>
            :
            <>
              {
                modifyCurrentUserAvatarLoading.success
                  ?
                  <>
                    <p className={`${styles.message} ${styles.success}`}>
                      {modifyCurrentUserAvatarLoading.message}
                    </p>
                    <button onClick={onClose} className={`${styles.blackSubmit} ${styles.small}`}>OK</button>
                  </>
                  :
                  <>
                    <p className={`${styles.message} ${styles.error}`}>
                      {modifyCurrentUserAvatarLoading.message}
                    </p>
                    <button onClick={onClose} className={`${styles.blackSubmit} ${styles.small}`}>OK</button>
                  </>
              }
            </>

        }
      </DivWithSpinner>
    </div>



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