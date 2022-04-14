import React from 'react'
import Header from "./Header"
import Footer from "./Footer"

function Layout({children}) {
  return (
    <div className='bg-primary font-mono text-gray-100'>
        <Header/>
        <div className='flex flex-grow w-full max-w-7xl mx-auto'>
          {children}
        </div>
        <Footer/>
    </div>
  )
}

export default Layout