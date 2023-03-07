// declare module "*.module.css";
// declare module "*.module.scss";
// import { Quicksand, Karla } from '@next/font/google'
import Router from 'next/router';
import NProgress from 'nprogress'
import axios from 'axios'
import Meta from '../components/Meta'
import { server } from '../config/config'
import Navbar from '../components/Navbar'
import React, { useEffect, useState, useRef } from 'react'

import deleteItemFunc from '../utils/deleteItem'
import singleAddFunc from '../utils/singleAdd'

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
import '../styles/user.scss'
import '../styles/cart.scss'
import '../styles/pizzasSort.scss'

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({})
  const [user, setUser] = useState({})
  const [expanded, setExpanded] = useState(false)
  const [viewProduct, setViewProduct] = useState(false)
  const [itemToView, setItemToView] = useState({})

  const loader = useRef(null)

  useEffect(() => {
    // console.log('xddddddddddddddddddddddddd')
    NProgress.start()
    axios({
      method: 'get',
      url: `/api/cart/getCartAndUser`,
      // url: `api/cart/getCartAndUser`,
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': `${server}`,
        // Cookie: ctx.req.headers.cookie
      },
      onDownloadProgress: function (progressEvent) {

      },
    })
      .then(res => {
        const cartToSet = res?.data?.cart
        cartToSet.items = res?.data?.cart?.items?.filter(item => item.item !== null)
        setCart(cartToSet)
        setUser(res?.data?.user)

        NProgress.done(false)
        loader?.current?.classList.add('loaded')
        setTimeout(() => {
          loader?.current?.remove()
        }, 1500);
      })
      .catch(e => {
        console.warn(e)
      })
  }, [])

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
        className='loader'
        ref={loader}
      >
        <div className="spinner-border" role="status"></div>
      </div>
      <div
        onClick={expanded ? () => setExpanded(!expanded) : (a) => (a)}
      // className={`${viewProduct ? 'of-h' : ''}`}
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

// App.getInitialProps = async ({ Component, ctx }) => {
//   let cartData
//   let error
//   let userData = false

//   console.log('xddddddddddddddddddddddddd')
//   await axios({
//     method: 'get',
//     url: `${server}/cart/getCartAndUser`,
//     // url: `api/cart/getCartAndUser`,
//     withCredentials: true,
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       'Access-Control-Allow-Origin': `${server}`,
//       Cookie: ctx.req.headers.cookie
//     }
//   })
//     .then(res => {
//       cartData = res.data.cart
//       userData = res.data.user
//     })
//     .catch(e => {
//       const res = e.response?.data
//       ctx.res.setHeader('Set-Cookie', cookie.serialize('cart', res.cart, {
//         httpOnly: true
//       }));
//       error = true
//     })

//   let pageProps = {};
//   if (Component.getInitialProps) {
//     pageProps = await Component.getInitialProps(ctx);
//   }

//   if (error) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/'
//       }
//     }
//   } else {
//     return { pageProps, cartData, userData }
//   }
// }