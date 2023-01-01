import React from 'react'
import WithSpinner from "../../layout/WithSpinner/WithSpinner";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import Profile from "./Profile.component";
import { selectCurrentUserLoading, selectUserLoading, selectAllUsersLoading} from "../../../redux/loading.slice";
import {compose} from "redux";

const mapStateToProps= state => ({
    // isLoading: selectCurrentUserLoading(state).isLoading || selectAllUsersLoading(state).isLoading
})

const ProfileContainer=compose(
    connect(mapStateToProps),
    WithSpinner
)(Profile)

export default ProfileContainer
