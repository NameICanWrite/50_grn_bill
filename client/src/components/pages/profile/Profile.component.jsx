import React, { useEffect, useState } from "react"
import { createStructuredSelector } from "reselect";
import { forgetUserPassword, selectCurrentUser, modifyCurrentUser, modifyCurrentUserPassword, selectUserById, modifyCurrentUserEmail, modifyCurrentUserName, modifyCurrentUserAvatar, selectAllUsers } from "../../../redux/user/user.slice";
import { removeModifyLoadingMessages, resetModifyCurrentUserAvatarLoading, resetModifyCurrentUserEmailLoading, resetModifyCurrentUserNameLoading, resetModifyCurrentUserPasswordLoading, selectAllUsersLoading, selectAuthLoading, selectCurrentUserLoading, selectModifyCurrentUserAvatarLoading, selectModifyCurrentUserEmailLoading, selectModifyCurrentUserNameLoading, selectModifyCurrentUserPasswordLoading, setModifyCurrentUserNameLoading } from '../../../redux/loading.slice'
import { connect, useSelector } from "react-redux";

import { Modal, Box, Typography, AvatarGroup } from '@mui/material'

import styles from './Profile.module.sass'
import WithSpinner from '../../layout/WithSpinner/WithSpinner'
import emptyAvatar from '../../../assets/img/empty-avatar.jpg'
import baseUrl from "../../../api/baseUrl";
import { EditAvatarForm, EditEmailForm, EditNameForm, EditPasswordForm } from "./Forms";
import { setShowEditUserAvatar, setShowEditUserEmail, setShowEditUserName, setShowEditUserPassword } from "../../../redux/modals/modals.slice";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import DivWithSpinner from "../../layout/DivWithSpinner";

const Profile = ({
    // user: { name, avatar, isCurrent, email, title }, 
    removeLoadingMessages,
    setShowEditUserAvatar,
    setShowEditUserName,
    setShowEditUserEmail,
    setShowEditUserPassword,
    isAuthLoading,
    isCurrentUserLoading,
    isAllUsersLoading,
    ...otherProps
}) => {

    const { userId } = useParams()
    const { name, avatar, isCurrent, email, title, shouldBeActivated } = (useSelector(state => selectUserById(userId)(state)) || {})
    const navigate = useNavigate()

    const closeModifyModal = () => {
        removeLoadingMessages()
        navigate('.')
    }

    if (shouldBeActivated) return (
        <DivWithSpinner isLoading={isAuthLoading || isCurrentUserLoading || isAllUsersLoading}>
            <h2>{name}</h2>
            <h2>{email}</h2>
            <p>Please activate user</p>
        </DivWithSpinner>
    )


    return (
        <div>
            <DivWithSpinner isLoading={isAuthLoading || isCurrentUserLoading || isAllUsersLoading} className={styles.container}>
                <div className={styles.avatarWrapper}>
                    <img src={avatar ? `${baseUrl}/image/${avatar}` : emptyAvatar} alt="" className={styles.avatar} style={{cursor: isCurrent ? 'pointer' : 'default'}}
                        onClick={() => {
                            isCurrent && navigate('set-avatar')
                        }}
                    />
                    {isCurrent && <button ></button>}
                </div>
                <div className={styles.accountPropsWrapper}>
                    <div className={styles.nameWrapper}>
                        <div className={styles.username}>
                            {name}
                        </div>
                        {isCurrent && <button onClick={() => {
                            navigate('set-name')
                        }}></button>}
                    </div>
                    <div className={styles.titleWrapper}>
                        <div className={styles.title}>
                            {title}
                        </div>
                        {isCurrent && <button onClick={() => navigate('/receive-random-title')}></button>}
                    </div>
                    {isCurrent && <>
                        <div className={styles.emailWrapper}>
                            <div className={styles.email}>{email}</div>
                            <button onClick={() => {
                                navigate('set-email')
                            }}></button>
                        </div>
                        <div className={styles.passwordWrapper}>
                            <button  className={styles.changePasswordButton} onClick={() => {
                                navigate('set-password')
                            }}>Change password</button>
                        </div>
                    </>}
                </div>

            </DivWithSpinner>

            {isCurrent && <Routes>
                <Route path={'set-name'} element={
                    <Modal open={true} onClose={closeModifyModal} >
                        <EditNameForm className={styles.editForm} onClose={closeModifyModal} name={name} />
                    </Modal>
                } />
                <Route path={'set-email'} element={
                    <Modal open={true} onClose={closeModifyModal} >
                        <EditEmailForm className={styles.editForm} onClose={closeModifyModal} email={email} />
                    </Modal>
                } />
                <Route path={'set-password'} element={
                    <Modal open={true} onClose={closeModifyModal} >
                        <EditPasswordForm className={styles.editForm} onClose={closeModifyModal} />
                    </Modal>
                } />
                <Route path={'set-avatar'} element={
                    <Modal open={true} onClose={closeModifyModal} >
                        <EditAvatarForm className={`${styles.editForm} ${styles.avatarForm}`} onClose={closeModifyModal} avatar={avatar} />
                    </Modal>
                } />
            </Routes>}

        </div>
    )

    // return <div className={styles.Profile}>
    //     <img alt='avatar' className={styles.avatar} src={avatar ? `${baseUrl}/image/${avatar}` : emptyAvatar} />
    //     <div>{name}</div>
    //     <label htmlFor="Change avatar">Change avatar</label>
    //     <input type='file' name='Change avatar' onChange={handleAvatarInput} />
    //     <form onSubmit={onNameChangeSubmit}>
    //         <input
    //             name={'newName'}
    //             type={'text'}
    //             placeholder={'name'}
    //             value={allValues.newName}
    //             onChange={handleChange}
    //             required
    //         />
    //         <button type={'submit'}>Change name</button>
    //     </form>
    //     {changeNameMessage}
    //     <form onSubmit={onPasswordUpdateSubmit}>
    //         <input
    //             name={'currentPassword'}
    //             type={'password'}
    //             placeholder={'currentPassword'}
    //             value={allValues.currentPassword}
    //             onChange={handleChange}
    //             required
    //         />
    //         <input
    //             name={'newPassword'}
    //             type={'password'}
    //             placeholder={'new password'}
    //             value={allValues.newPassword}
    //             onChange={handleChange}
    //             required
    //         />
    //         <input
    //             name={'passwordConfirm'}
    //             type={'password'}
    //             placeholder={'password confirm'}
    //             value={allValues.passwordConfirm}
    //             onChange={handleChange}
    //             required
    //         />
    //         <button type={'submit'}>Change pass</button>
    //     </form>

    //     <form onSubmit={onForgetPasswordSubmit}>
    //         <input
    //             name={'email'}
    //             type={'email'}
    //             placeholder={'email'}
    //             value={allValues.email}
    //             onChange={handleChange}
    //             required
    //         />
    //         <button type={'submit'}>reset pass</button>
    //     </form>
    // </div>
}

const mapStateToProps = (state, ownProps) => ({
    // user: selectUserById(ownProps.match.params.userId)(state),
    // modifyCurrentUserNameLoading: selectModifyCurrentUserNameLoading(state),
    // modifyCurrentUserPasswordLoading: selectModifyCurrentUserPasswordLoading(state),
    // modifyCurrentUserEmailLoading: selectModifyCurrentUserEmailLoading(state),
    // modifyCurrentUserAvatarLoading: selectModifyCurrentUserAvatarLoading(state)

    isAuthLoading: selectAuthLoading(state).isLoading,
    isCurrentUserLoading: selectCurrentUserLoading(state).isLoading,
    isAllUsersLoading: selectAllUsersLoading(state).isLoading,
})

const mapDispatchToProps = dispatch => ({
    modifyCurrentUserName: data => dispatch(modifyCurrentUserName(data)),
    modifyCurrentUserEmail: data => dispatch(modifyCurrentUserEmail(data)),
    modifyCurrentUserPassword: data => dispatch(modifyCurrentUserPassword(data)),
    modifyCurrentUserAvatar: avatar => dispatch(modifyCurrentUserAvatar(avatar)),
    removeLoadingMessages: () => dispatch(removeModifyLoadingMessages()),
    resetModifyNameLoading: () => dispatch(resetModifyCurrentUserNameLoading()),
    resetModifyEmailLoading: () => dispatch(resetModifyCurrentUserEmailLoading()),
    resetModifyPasswordLoading: () => dispatch(resetModifyCurrentUserPasswordLoading()),
    resetModifyAvatarLoading: () => dispatch(resetModifyCurrentUserAvatarLoading()),

    setShowEditUserAvatar: () => dispatch(setShowEditUserAvatar()),
    setShowEditUserEmail: () => dispatch(setShowEditUserEmail()),
    setShowEditUserPassword: () => dispatch(setShowEditUserPassword()),
    setShowEditUserName: () => dispatch(setShowEditUserName()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)


