import React from 'react'
import { Outlet } from 'react-router'
import Nav from './navbar/Nav'
import Footer from './footer/Footer'

const MainLayout = () => {
  return (
    <>
      <div className="main-layout">
      <Nav />
      <div className="content-wrapper">
        <Outlet />
      </div>
      <Footer />
    </div>
    </>
  );
}

export default MainLayout