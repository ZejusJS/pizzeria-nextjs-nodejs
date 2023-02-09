declare module "*.module.css";
declare module "*.module.scss";
// import { Quicksand, Karla } from '@next/font/google'
import Meta from '../components/Meta'
import { server } from '../config/config'
import '../styles/loading.scss'
import '../styles/nprogress.scss'
import '../styles/changeDefault.scss'
import '../styles/globalStyles.scss'
import '../styles/viewProduct.scss'
import '../styles/checkout.scss'
import '../styles/new-pizza.scss'
import '../styles/statics.scss'
import '../styles/navbar.scss'
import '../styles/auth.scss'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import React, { createContext, useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import bootstrap from 'bootstrap'
import NProgress from 'nprogress'
import axios from 'axios'
import deleteItemFunc from '../utils/deleteItem'
import singleAddFunc from '../utils/singleAdd'

// const quicksand = Quicksand({
//   weight: ['400', '600', '700'],
//   subsets: ['latin'],
// })

// const karla = Karla({
//   weight: ['200', '300', '400', '500', '600', '700', '800'],
//   subsets: ['latin']
// })

export default function App({ Component, pageProps, cartData, userData }) {
  const [cart, setCart] = useState(cartData)
  const [user, setUser] = useState(userData)
  const [expanded, setExpanded] = useState(false)
  const [viewProduct, setViewProduct] = useState(false)
  const [itemToView, setItemToView] = useState({})

  useEffect(() => {
    if (viewProduct) document.body.classList.add('of-h')
    if (!viewProduct) document.body.classList.remove('of-h')
  }, [viewProduct])

  useEffect(() => {
    if (expanded) document.body.classList.add('of-h')
    if (!expanded) document.body.classList.remove('of-h')
  }, [expanded])

  Router.events.on("routeChangeStart", (url) => {
    NProgress.start()
  })

  Router.events.on("routeChangeComplete", (url) => {
    NProgress.done(false)
  });


  async function singleAdd(e, piz) {
    setCart(await singleAddFunc(e, piz))
  }

  async function deleteItem(e, piz) {
    setCart(await deleteItemFunc(e, piz))
  }

  function viewItem(e, item) {
    setItemToView(item)
    setViewProduct(true)
  }

  function unViewItem(e) {
    e.stopPropagation()
    e.preventDefault();
    setItemToView({})
    setViewProduct(false)
  }

  return (
    <>
      <Meta />
      <Navbar
        cart={cart}
        expanded={expanded}
        setExpanded={setExpanded}
        user={user}
      />
      <div
        onClick={expanded ? () => setExpanded(!expanded) : (a) => (a)}
        className={`${viewProduct ? 'of-h' : 'sd'}`}
      >
        <Component
          {...pageProps}
          setCart={setCart}
          cart={cart}
          user={user}
          setUser={setUser}
          viewProduct={viewProduct}
          itemToView={itemToView}
          singleAdd={(e, piz) => singleAdd(e, piz)}
          unViewItem={(e) => unViewItem(e)}
          deleteItem={(e, piz) => deleteItem(e, piz)}
          viewItem={(e, i) => viewItem(e, i)}
        />
      </div>
    </>
  )
}

import * as cookie from 'cookie'

App.getInitialProps = async ({ Component, ctx }) => {
  let cartData
  let error
  let userData = false

  await axios({
    method: 'get',
    url: `${server}/cart/getCartAndUser`,
    // url: `api/cart/getCartAndUser`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Access-Control-Allow-Origin': `${server}`,
      Cookie: ctx.req.headers.cookie
    }
  })
    .then(res => {
      cartData = res.data.cart
      userData = res.data.user
    })
    .catch(e => {
      const res = e.response.data
      ctx.res.setHeader('Set-Cookie', cookie.serialize('cart', res.cart, {
        httpOnly: true
      }));
      error = true
    })

  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  if (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  } else {
    return { pageProps, cartData, userData }
  }
}