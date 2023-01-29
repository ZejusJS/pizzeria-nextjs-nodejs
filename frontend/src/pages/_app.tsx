declare module "*.module.css";
declare module "*.module.scss";
import { Quicksand, Karla } from '@next/font/google'
import Meta from '../components/Meta'
import { server } from '../config/config'
import '../styles/globalStyles.scss'
import Navbar from '../components/Navbar'
import Link from 'next/link'

const quicksand = Quicksand({
  weight: ['400', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
})

const karla = Karla({
  weight: ['200', '400', '500', '600', '700', '800'],
  style: ['normal'],
  subsets: ['latin', 'latin-ext'],
})


export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>
        {`
          * {
            font-family: ${karla.style.fontFamily};
            box-sizing: border-box;
            margin: 0;
          }
          h1,h2,h3,h4,h5,h6 {
            font-family: ${quicksand.style.fontFamily};
          }
        `}
      </style>
      <Meta />
      <Navbar />
      <main>
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
      </main>
    </>
  )
}
