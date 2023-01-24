import { Quicksand, Karla } from '@next/font/google'
import Meta from '../components/Meta'
import { server } from '../config/config'
import styles from '../styles/globalStyles.scss'
import Navbar from '@/components/Navbar'

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
      </main>
    </>
  )
}
