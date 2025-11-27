import React from 'react'
import logo from '../assets/logo.png'

function Logo({width}) {
  return (
    <img style={{ width, height: 'auto' }} src={logo} alt="Logo" />
  )
}

export default Logo