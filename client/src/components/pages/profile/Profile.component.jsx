import React, { useEffect, useState } from "react"
import { createStructuredSelector } from "reselect";
import { forgetUserPassword, selectCurrentUser, modifyCurrentUser, modifyCurrentUserPassword, selectUserById, modifyCurrentUserEmail, modifyCurrentUserName, modifyCurrentUserAvatar, selectAllUsers } from "../../../redux/user/user.slice";
import { removeModifyLoadingMessages, selectAllUsersLoading, selectAuthLoading, selectCurrentUserLoading, selectModifyCurrentUserAvatarLoading, selectModifyCurrentUserEmailLoading, selectModifyCurrentUserNameLoading, selectModifyCurrentUserPasswordLoading } from '../../../redux/loading.slice'
import { connect, useSelector } from "react-redux";

import {Modal, Box, Typography} from '@mui/material'

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
    const [currentFormName, setCurrentFormName] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)
    const { userId } = useParams()
    const users = useSelector(state => selectAllUsers(state))
    console.log(users)
    console.log(userId);
    const { name, avatar, isCurrent, email, title } = (useSelector(state => selectUserById(userId)(state)) || {})
    const navigate = useNavigate()

    return (
        <div>
            <DivWithSpinner isLoading={isAuthLoading || isCurrentUserLoading || isAllUsersLoading}>
                <div>
                    <img src={avatar ? `${baseUrl}/image/${avatar}` : emptyAvatar} alt="" style={{height: '40px', width: '40px'}} />
                    {isCurrent && <button onClick={() => {
                        navigate('set-avatar')
                    }}>Edit avatar</button>}
                </div>
                <div >
                    <div>
                        {name}
                    </div>
                    {isCurrent && <button onClick={() => {
                        navigate('set-name')
                    }}>Edit name</button>}
                </div>
                <div>
                    <div>
                        {title}
                    </div>
                    {isCurrent && <button onClick={() => navigate('/receive-random-title')}>Receive new title</button>}
                </div>
                {isCurrent && <>
                    <div>
                        <div>{email}</div>
                        <button onClick={() => {
                        navigate('set-email')
                        }}>Change email</button>
                    </div>
                    <div>
                        <button onClick={() => {
                        navigate('set-password')
                        }}>Change password</button>
                    </div>
                </>}
            </DivWithSpinner>
            
            {isCurrent && <Routes>
                <Route path={'set-name'} element={
                    <Modal open={true} onClose={() => navigate('.')} >
                        <EditNameForm name={name}/>
                    </Modal>
                } />
                <Route path={'set-email'} element={
                    <Modal open={true} onClose={() => navigate('.')} >
                        <EditEmailForm email={email}/>
                    </Modal>
                } />
                <Route path={'set-password'} element={
                    <Modal open={true} onClose={() => navigate('.')} >
                        <EditPasswordForm />
                    </Modal>
                } />
                <Route path={'set-avatar'} element={
                    <Modal open={true} onClose={() => navigate('.')} >
                        <EditAvatarForm />
                    </Modal>
                } />
            </Routes>}
                {/* {
                    (() => {
                        console.log(isModalOpen);
                        if (currentFormName === 'name') return (
                            <Modal open={isModalOpen} onClose={closeModal}>
                                <EditNameForm name={name} />
                            </Modal>
                        )
    
                        if (currentFormName === 'email') return (
                            <Modal open={isModalOpen} onClose={closeModal}>
                                <EditEmailForm  email={email} />
                            </Modal>
                        )
                
                        if (currentFormName === 'password') return (
                            <Modal open={isModalOpen} onClose={closeModal}>
                                <EditPasswordForm  />
                            </Modal>
                        )
                   
                        if (currentFormName === 'avatar') return (
                            <Modal open={isModalOpen} onClose={closeModal}>
                                <EditAvatarForm  />
                            </Modal>
                        )
                        return <></>
                    })()
                } */}
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
    setShowEditUserAvatar: () => dispatch(setShowEditUserAvatar()),
    setShowEditUserEmail: () => dispatch(setShowEditUserEmail()),
    setShowEditUserPassword: () => dispatch(setShowEditUserPassword()),
    setShowEditUserName: () => dispatch(setShowEditUserName()), 
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)


