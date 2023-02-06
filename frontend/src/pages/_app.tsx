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
import Navbar from '../components/Navbar'
import Link from 'next/link'
import React, { createContext, useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import bootstrap from 'bootstrap'
import NProgress from 'nprogress'
import axios from 'axios'

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
  const [expanded, setExpanded] = useState(false)

  console.log(userData)

  Router.events.on("routeChangeStart", (url) => {
    NProgress.start()
  })

  Router.events.on("routeChangeComplete", (url) => {
    NProgress.done(false)
  });

  return (
    <>
      <Meta />
      <Navbar cart={cart} expanded={expanded} setExpanded={setExpanded} />
      <div onClick={expanded ? () => setExpanded(!expanded) : (a) => (a)}>
        <Component {...pageProps} setCart={setCart} cart={cart} />
      </div>
    </>
  )
}

import * as cookie from 'cookie'
import jwt from 'jsonwebtoken'

App.getInitialProps = async ({ Component, ctx }) => {
  let cartData
  let error
  let userData = false

  function cookiesParse() {
    const getCookies = ctx.req.headers.cookie
    let cookies = {}
    let cookiesArray = getCookies.split('; ')
    cookiesArray.map(cook => {
      let cks = cook.split('=')
      let name = cks[0]
      let value = cks[1]
      cookies = { ...cookies, [name]: value }
    })
    return cookies
  }

  const cookies:any = cookiesParse()
  userData = cookies.mammamia ? jwt.decode(cookies.mammamia) : false

  await axios({
    method: 'get',
    url: `${server}/cart/getCart`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Access-Control-Allow-Origin': `${server}`,
      Cookie: ctx.req.headers.cookie
    }
  })
    .then(res => cartData = res.data)
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