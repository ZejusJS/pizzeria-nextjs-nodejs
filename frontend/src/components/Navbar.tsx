import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav>
      <Link href='/'>
        <img className='logo' src="/favicon.svg" alt="" />
        <h1>Mamma Mia</h1>
      </Link>
    </nav>
  )
}

export default Navbar