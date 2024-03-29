// declare module "*.module.css";
// declare module "*.module.scss";
// import { Quicksand, Karla } from '@next/font/google'
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress'
import axios from 'axios'
import Meta from '../components/Meta'
import React, { useEffect, useState, useRef } from 'react'
import { getCookie } from 'cookies-next';
import { NextRouter } from 'next/router'
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import deleteItemFunc from '../utils/deleteItem'
import singleAddFunc from '../utils/singleAdd'
import changeQntFunc from '../utils/changeQnt'
import restoreItemFunc from '../utils/restoreItem'
import { usePreserveScroll } from '../utils/hooks/preserveScroll';

import { server } from '../config/config'
import ErrorSvg from '../images/Error'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/loading.scss'
import '../styles/nprogress.scss'
import '../styles/changeDefault.scss'
import '../styles/globalStyles.scss'
import '../styles/pizza-list.scss'
import '../styles/viewProduct.scss'
import '../styles/checkout.scss'
import '../styles/new-pizza.scss'
import '../styles/statics.scss'
import '../styles/navbar.scss'
import '../styles/auth.scss'
import '../styles/user.scss'
import '../styles/user-orders.scss'
import '../styles/cart.scss'
import '../styles/pizzasSort.scss'
import '../styles/admin.scss'
import '../styles/admin-orders.scss'
import '../styles/footer.scss'
import '../styles/admin-pizzas.scss'
import '../styles/error.scss'
import '../styles/error-boundary.scss'
import '../styles/spinners.scss'
import '../styles/landing-page.scss'
import '../styles/terms.scss'

import Product from '../components/pizza/Product'
import Unfocus from '../components/Unfocus'
import Footer from '../components/Footer'
import ErrorBoundary from '../components/Error'
import Navbar from '../components/Navbar'

interface Cart {
  totalCartPrice?: number;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5
    }
  }
})

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState<Cart>({})
  const [userData, setUserData] = useState({})
  const [expanded, setExpanded] = useState(false)
  const [viewProduct, setViewProduct] = useState(false)
  const [itemToView, setItemToView] = useState({})
  const [isLoadingFirstData, setIsLoadingFirstData] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(0)
  const [totalCartPrice, setTotalCartPrice] = useState(0)
  const [productError, setProductError] = useState(0)
  const [productErrorText, setProductErrorText] = useState('')

  const router: NextRouter = useRouter()

  const scrollPositions = useRef<{ [url: string]: number }>({})
  usePreserveScroll(scrollPositions)

  const loaderRef = useRef(null)

  NProgress.configure({ trickleSpeed: 400, minimum: 0.1 });

  async function fetchFirstData(loading: boolean = true) {
    setIsLoadingFirstData(true)
    // if (loading) {
    //   setLoaded(false)
    //   NProgress.start()
    // }

    await axios({
      method: 'get',
      url: `/api2/cart/getCartAndUser`,
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': `${server}`,
      },
      onDownloadProgress: function (progressEvent) {
        setIsLoadingFirstData(false)
      },
    })
      .then(res => {
        const cartToSet = res?.data?.cart
        cartToSet.items = res?.data?.cart?.items?.filter(item => item?.item !== null)
        setCart(cartToSet)
        setUserData(res?.data?.user)
        setTotalCartPrice(cartToSet.totalCartPrice)

        // if (loading) {
        //   setLoaded(true)
        //   NProgress.done(false)
        // }
      })
      .catch(e => {
        console.error(e)
        if (e.response?.data?.newCart) {
          // router.reload()
        } else {
          setError(e.response.status)
        }
      })
    return
  }

  useEffect(() => {
    fetchFirstData(true)
  }, [])

  useEffect(() => {
    if (document.body.offsetHeight > window.innerHeight) document.body.classList.add('margin')
    if (viewProduct) document.body.classList.add('of-h')
    if (!viewProduct) document.body.classList.remove('of-h')
    if (!viewProduct) document.body.classList.remove('margin')
  }, [viewProduct])

  useEffect(() => {
    if (document.body.offsetHeight > window.innerHeight) document.body.classList.add('margin')
    if (expanded) document.body.classList.add('of-h')
    if (!expanded) document.body.classList.remove('of-h')
    if (!expanded) document.body.classList.remove('margin')
  }, [expanded])

  const [urlsHistory, setUrlsHistory] = useState([])

  Router.events.on("routeChangeStart", (url) => {
    NProgress.start()
  })

  Router.events.on("routeChangeComplete", (url) => {
    NProgress.done(false)
  });

  useEffect(() => {
    if (urlsHistory[0] !== router.asPath) {
      setUrlsHistory(prev => ([...prev, router.asPath]))
    }
  }, [router.asPath]);

  async function singleAdd(e, piz) {
    await singleAddFunc(e, piz, setTotalCartPrice)
      .then(res => setCart(res))
      .catch(e => fetchFirstData(false))
    return
  }

  async function deleteItem(e, piz) {
    await deleteItemFunc(e, piz, setTotalCartPrice)
      .then(res => setCart(res))
      .catch(e => fetchFirstData(false))
    return
  }

  async function changeQnt(e, qnt, item) {
    await changeQntFunc(e, qnt, item, setCart, setTotalCartPrice, setProductError, setProductErrorText)
    return
  }

  async function restoreItem(e, id) {
    await restoreItemFunc(e, id)
    if (router.pathname.match(/(\/admin\/deleted-pizzas)/)) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query }
      }, '', { shallow: false })
    }
    return
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
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Meta />
        <Navbar
          cart={cart}
          expanded={expanded}
          setExpanded={setExpanded}
          user={userData}
          fetchFirstData={() => fetchFirstData(true)}
          router={router}
          isLoadingFirstData={isLoadingFirstData}
        />
        <div className={`fetcing-spinner-con ${isLoadingFirstData ? 'shown' : ''}`}>
          <div className="lds-dual-ring"></div>
        </div>

        <div
          className={`loader ${loaded ? 'loaded' : 'loaded'}`}
          ref={loaderRef}
        >
          {!error ?
            <div className="spinner-border" role="status"></div>
            :
            <ErrorSvg />}
          <div className='error-msgs'>
            <p className={`msg ${error ? 'visible' : ''}`}>
              Something went wrong...
            </p>
            <p className={`msg ${error ? 'visible' : ''}`}>
              Try reloading a page. A problem can be also on our side.
            </p>
            <p className={`msg code ${error === 500 ? 'visible' : ''}`}>
              Error code: <b>500</b> - A problem is on our servers.
            </p>
            <p className={`msg code ${error === 400 && getCookie('cart') !== 'error' ? 'visible' : ''}`}>
              Error code: <b>400</b> - Something went wrong on your side.
            </p>
            <p className={`msg code ${getCookie('cart') === 'error' ? 'visible' : ''}`}>
              <b>Cart error</b> - Something went wrong probably on our side.
              We can't provide you a cart. Try to refresh a page after 10 seconds.
            </p>
          </div>
        </div>

        <>
          <div className={`product-error-con ${productError === 1 || productError === 2 ? 'shown' : ''}`}>
            <div className='product-error'>
              {productErrorText}
            </div>
          </div>
        </>

        <div
          onClick={expanded ? () => setExpanded(!expanded) : (a) => (a)}
        // className={`${viewProduct ? 'of-h' : ''}`}
        >
          {viewProduct ? <Unfocus onClick={(e) => unViewItem(e)} /> : ''}
          {viewProduct ?
            <Product
              onClick={(e) => unViewItem(e)}
              item={itemToView}
              cart={cart}
              deleteItem={(e, piz) => deleteItem(e, piz)}
              singleAdd={(e, piz) => singleAdd(e, piz)}
              user={userData}
              restoreItem={restoreItem}
            />
            : ''}
          <ErrorBoundary>
            <Component
              {...pageProps}
              setCart={setCart}
              cart={cart}
              user={userData}
              userData={userData}
              setUser={setUserData}
              viewProduct={viewProduct}
              itemToView={itemToView}
              singleAdd={(e, piz) => singleAdd(e, piz)}
              unViewItem={(e) => unViewItem(e)}
              deleteItem={(e, piz) => deleteItem(e, piz)}
              viewItem={(e, i) => viewItem(e, i)}
              fetchFirstData={(loading: boolean) => fetchFirstData(loading)}
              totalCartPrice={totalCartPrice}
              setTotalCartPrice={setTotalCartPrice}
              changeQnt={changeQnt}
              router={router}
              isLoadingFirstData={isLoadingFirstData}
              urlsHistory={urlsHistory}
              scrollPositions={scrollPositions}
            />
          </ErrorBoundary>
        </div>
        <Footer />
      </QueryClientProvider>
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