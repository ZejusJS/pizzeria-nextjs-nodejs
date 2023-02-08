import { useEffect, useState } from 'react'
import Link from 'next/link'
import { server } from '../config/config'
import NavSvg from '../images/Nav'
import CartSvg from '../images/Cart'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import axios from 'axios'

const Navbar = ({ cart, setExpanded, expanded, user }) => {
  let itemsCount = 0
  cart.items.map(item => {
    itemsCount += item.quantity
  })

  function changeExpanded() {
    setExpanded(prevExp => !prevExp)
  }

  const router = useRouter();

  useEffect(() => {
    if (expanded) {
      setExpanded(!expanded);
    }
  }, [router.asPath]);

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
        e.target.classList.add('btn-cart-loading')
        NProgress.start()
      },
      onDownloadProgress: function (progressEvent) {
        e.target.classList.remove('btn-cart-loading')
        NProgress.done(false)
      },
    })
      .then(res => window.location.replace('/'))
      .catch(e => console.log(e))
  }

  return (
    <nav>
      <div className={`nav-container ${expanded ? 'expanded' : ''}`}>
        <div>
          <div className='logo-name'>
            <Link href='/' className='logo-link'>
              <img className='logo' src="/favicon.svg" alt="" />
              <h1>Mamma Mia</h1>
            </Link>
            <div className='options-container'>
              <Link href={'/cart'}>
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
        <div className='links'>
          <div>
            <Link href='/'>
              Home page
            </Link>
            <Link href='/about'>
              About
            </Link>
          </div>
          <div>
            <Link href='/cart'>
              Cart
            </Link>
          </div>
          <div>
            {!user.email ?
              <>
                <Link href='/signup'>
                  Sign Up
                </Link>
                <Link href='/login'>
                  Log in
                </Link>
              </>
              : ''
            }
            {/* <a href={`${server}/user/logout`}>Logout</a> */}
            {user.email ?
              <form className='log-out' onSubmit={(e) => logout(e)}>
                <button type='submit'>Log Out</button>
              </form>
              : ''
            }
          </div>
          {user.roles?.admin ?
            <div>
              <Link href='/admin/new-pizza'>
                Create a new pizza
              </Link>
            </div>
            : ''}
        </div>
      </div>
    </nav>
  )
}

export default Navbar