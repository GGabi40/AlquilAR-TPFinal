import React from 'react'
import { Outlet } from 'react-router'
import Nav from './navbar/Nav'

const MainLayout = () => {
  return (
    <>
        <Nav />
        <Outlet />
    </>
 )
}

export default MainLayout