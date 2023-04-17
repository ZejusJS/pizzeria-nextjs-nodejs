import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { server } from '../config/config'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import axios from 'axios'
import { NextRouter } from 'next/router'
import { NextPage } from "next"

import UserCircleSvg from "../images/UserCircle"
import NavSvg from '../images/Nav'
import CartSvg from '../images/Cart'

interface withRouter {
  router: NextRouter,
  cart,
  setExpanded,
  expanded,
  user,
  fetchFirstData,
  isLoadingFirstData
}

const Navbar: NextPage<withRouter> = ({
  cart,
  setExpanded,
  expanded,
  user,
  fetchFirstData,
  router,
  isLoadingFirstData }) => {
  let itemsCount = 0
  cart?.items?.map(item => {
    itemsCount += Number(item.quantity)
  })

  function changeExpanded() {
    setExpanded(prevExp => !prevExp)
  }


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
      url: `/api2/user/logout`,
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
      .then(res => {
        fetchFirstData().then(() => {
          if (router.pathname.match(/(\/user)|(\/checkout)|(\/admin)/gi)) {
            router.replace('/')
          }
        })
      })
      .catch(e => console.log(e))
  }

  return (
    <>
      <nav>
        <div className={`nav-container ${expanded ? 'expanded' : ''}`}>
          <div>
            <div className='logo-name'>
              <Link href='/' className='logo-link' shallow={false} prefetch={false}>
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
            <div className='link-con'>
              <Link href='/' shallow={false}>
                Home page
              </Link>
            </div>
            <div className='link-con'>
              <Link href='/menu'>
                Menu
              </Link>
            </div>
            {/* <div>
            <Link href='/cart'>
              Cart
            </Link>
          </div> */}
            {!user?.email && !isLoadingFirstData ?
              <>
                <div className='link-con auth'>
                  <Link href='/user/signup'>
                    Sign Up
                  </Link>
                </div>
                <div className='link-con auth'>
                  <Link href='/user/login'>
                    Login
                  </Link>
                </div>
              </>
              : user?.email ?
                <>
                  <div className='link-con auth'>
                    <form className='log-out' onSubmit={(e) => logout(e)}>
                      <button type='submit'>Log Out</button>
                    </form>
                  </div>
                  <div className='link-con user'>
                    <Link href='/user/profile'>
                      <UserCircleSvg />
                    </Link>
                  </div>
                </>
                :
                <div className='link-con auth-loading' role='status'>
                  <UserCircleSvg />
                </div>
            }
            {user.roles?.admin ?
              <div className='link-con four'>
                <Link href='/admin'>
                  Admin
                </Link>
              </div>
              : ''}
          </div>
          <div className='links linky'>
            <div className='link'>
              <Link href='/' shallow={false} >
                Home page
              </Link>
              <Link href='/menu' shallow={false} >
                Menu
              </Link>
              <Link href='/about' >
                About
              </Link>
            </div>
            <div className='link'>
              <Link href='/cart' >
                Cart
              </Link>
            </div>
            <div className='link user-links'>
              {!user.email && !isLoadingFirstData?
                <>
                  <Link href='/user/signup' >
                    Sign Up
                  </Link>
                  <Link href='/user/login' >
                    Login
                  </Link>
                </>
                : user?.email ?
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
                  :
                  <div className='auth-loading' role='status'>
                    <UserCircleSvg />
                  </div>
              }
            </div>
            {user.roles?.admin ?
              <div className='link'>
                <Link href='/admin' prefetch={false}>
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