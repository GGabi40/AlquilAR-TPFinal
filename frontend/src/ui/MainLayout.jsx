import React from 'react'
import { Outlet } from 'react-router'
import Nav from './navbar/Nav'
import Footer from './footer/Footer'

const MainLayout = () => {
  return (
    <>
        <Nav />
        <Outlet />
        <Footer/>
    </>
 )
}

export default MainLayout