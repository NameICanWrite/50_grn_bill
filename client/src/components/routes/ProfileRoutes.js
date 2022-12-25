import { Modal } from "@mui/material"
import { useNavigate, Routes, Route } from "react-router-dom"
import { EditAvatarForm, EditEmailForm, EditNameForm, EditPasswordForm } from "../pages/profile/Forms"
import ProfileContainer from "../pages/profile/Profile.container"



export const ProfileRoutes = (props) => {
  const navigate = useNavigate()
  return (
  <>
    <ProfileContainer {...props} /> 
    <Routes>
      
    </Routes>
  </>
  )
}