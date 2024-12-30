import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
        <main className='p-4 pt-32 h-screen dark:bg-gray-950'>
            <Outlet/>
        </main>
    </>
  )
}

export default Layout