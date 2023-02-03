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
import '../styles/statics.scss'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router';
import bootstrap from 'bootstrap'
import NProgress from 'nprogress'

// const quicksand = Quicksand({
//   weight: ['400', '600', '700'],
//   subsets: ['latin'],
// })

// const karla = Karla({
//   weight: ['200', '300', '400', '500', '600', '700', '800'],
//   subsets: ['latin']
// })

export default function App({ Component, pageProps }) {
  // const router = useRouter();
  // const [pageLoading, setPageLoading] = React.useState<boolean>(false);
  // React.useEffect(() => {
  //   const handleStart = () => { setPageLoading(true); };
  //   const handleComplete = () => { setPageLoading(false); };

  //   router.events.on('routeChangeStart', handleStart);
  //   router.events.on('routeChangeComplete', handleComplete);
  //   router.events.on('routeChangeError', handleComplete);
  // }, [router]);

  Router.events.on("routeChangeStart", (url) => {
    NProgress.start()
  })

  Router.events.on("routeChangeComplete", (url) => {
    NProgress.done(false)
  });

  return (
    <>
      <Meta />
      {/* {
        (pageLoading)
          ?
          <div className='loading-page'>
            <div className='spinner-container'>
              <div className="spinner-border" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          </div>
          :
          <div className='loading-page'>
            <div className='spinner-container'>
              <div className="spinner-border" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          </div>
      } */}
      <Navbar />
      <>
        <Component {...pageProps} />
        <hr />
        <Link href='/about'>
          About
        </Link> <br />
        <Link href='/'>
          Home page
        </Link> <br />
        <Link href='/cart'>
          Cart
        </Link> <br />
        <Link href='/signup'>
          Sign Up
        </Link> <br />
        <Link href='/login'>
          Log in
        </Link> <br />
        <a href={`${server}/user/logout`}>Logout</a>
      </>
    </>
  )
}