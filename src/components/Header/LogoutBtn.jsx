import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
    className='inline-bock px-6 py-4 duration-200 text-[#358600] font-semibold hover:text-black-700 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn