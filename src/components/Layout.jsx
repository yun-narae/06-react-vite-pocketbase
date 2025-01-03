import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
        <main className='min-h-screen p-4 pt-32 dark:bg-gray-950'>
            <Outlet/>
        </main>
    </>
  )
}

export default Layout