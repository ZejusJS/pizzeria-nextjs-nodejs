declare module "*.module.css";
declare module "*.module.scss";
import { Quicksand, Karla } from '@next/font/google'
import Meta from '../components/Meta'
import { server } from '../config/config'
import '../styles/globalStyles.scss'
import '../styles/changeDefault.scss'
import '../styles/viewProduct.scss'
import Navbar from '../components/Navbar'
import Link from 'next/link'

const quicksand = Quicksand({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
})

const karla = Karla({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin']
})


export default function App({ Component, pageProps }) {
  return (
    <>
      <Meta />
      <Navbar />
      <>
        <Component {...pageProps} />
        <Link href='/about'>
          About
        </Link> <br />
        <Link href='/signup'>
          Sign Up
        </Link> <br />
        <Link href='/login'>
          Log in
        </Link> <br />
        <Link href='/'>
          Home page
        </Link> <br />
        <Link href='/cart'>
          Cart
        </Link>
      </>
    </>
  )
}
