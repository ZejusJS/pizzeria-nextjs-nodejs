import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { server } from '../config/config'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import axios from 'axios'

import UserCircleSvg from "../images/UserCircle"
import NavSvg from '../images/Nav'
import CartSvg from '../images/Cart'

const Navbar = ({ cart, setExpanded, expanded, user }) => {
  let itemsCount = 0
  cart?.items?.map(item => {
    itemsCount += Number(item.quantity)
  })

  function changeExpanded() {
    setExpanded(prevExp => !prevExp)
  }

  const router = useRouter();
  useEffect(() => {
    if (expanded) {
      setExpanded(!expanded);
    }
  }, [router]);

  async function logout(e) {
    e.preventDefault()
    await axios({
      method: 'post',
      // url: `${server}/cart/singleAdd`,
      url: `/api/user/logout`,
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': `${server}`
      },
      withCredentials: true,
      onUploadProgress: function (progressEvent) {
        NProgress.start()
      },
      onDownloadProgress: function (progressEvent) {
        NProgress.done(false)
      },
    })
      .then(res => window.location.replace('/'))
      .catch(e => console.log(e))
  }
  
  return (
    <>
      <nav>
        <div className={`nav-container ${expanded ? 'expanded' : ''}`}>
          <div>
            <div className='logo-name'>
              <Link href='/' className='logo-link' shallow={true}>
                <img className='logo' src="/favicon.svg" alt="" />
                <h1>Mamma Mia</h1>
              </Link>
              <div className='options-container'>
                <Link href={'/cart'}
                  className="cart-href"
                  >
                  <div className='cart'>
                    <CartSvg />
                    <div className='items-count'>
                      {itemsCount}
                    </div>
                  </div>
                </Link>
                <div className='expand-nav' onClick={changeExpanded}>
                  <NavSvg />
                </div>
              </div>
            </div>
          </div>

          <div className='links-row linky'>
            <div>
              <Link href='/' shallow={true} >
                Home page
              </Link>
            </div>
            <div>
              <Link href='/about'>
                About
              </Link>
            </div>
            {/* <div>
            <Link href='/cart'>
              Cart
            </Link>
          </div> */}
            {!user.email ?
              <>
                <div className='auth'>
                  <Link href='/user/signup'>
                    Sign Up
                  </Link>
                </div>
                <div className='auth'>
                  <Link href='/user/login'>
                    Login
                  </Link>
                </div>
              </>
              :
              <>
                <div>
                  <form className='log-out' onSubmit={(e) => logout(e)}>
                    <button type='submit'>Log Out</button>
                  </form>
                </div>
                <div className='user'>
                  <Link href='/user/profile'>
                    <UserCircleSvg />
                  </Link>
                </div>
              </>
            }
            {user.roles?.admin ?
              <div className='four'>
                <Link href='/admin'>
                  Admin
                </Link>
              </div>
              : ''}
          </div>
          <div className='links linky'>
            <div className='link'>
              <Link href='/' shallow={true}>
                Home page
              </Link>
              <Link href='/about'>
                About
              </Link>
            </div>
            <div className='link'>
              <Link href='/cart'>
                Cart
              </Link>
            </div>
            <div className='link user-links'>
              {!user.email ?
                <>
                  <Link href='/user/signup'>
                    Sign Up
                  </Link>
                  <Link href='/user/login'>
                    Login
                  </Link>
                </>
                :
                <>
                  <div>
                    <form className='log-out' onSubmit={(e) => logout(e)}>
                      <button type='submit'>Log Out</button>
                    </form>
                  </div>
                  <div className='user'>
                    <Link href='/user/profile'>
                      <UserCircleSvg /> <span>{user.name}</span>
                    </Link>
                  </div>
                </>
              }
            </div>
            {user.roles?.admin ?
              <div className='link'>
                <Link href='/admin'>
                  Admin
                </Link>
              </div>
              : ''}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar