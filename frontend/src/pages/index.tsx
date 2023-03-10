import Head from 'next/head'
import Image from 'next/image'
import Meta from '../components/Meta'
import { server } from '../config/config'
import axios from "axios";
import Pizzalist from '../components/pizza/Pizzalist';
import { useState } from 'react';
import Product from '../components/pizza/Product';
import Unfocus from '../components/Unfocus';
import { useRouter } from 'next/router';

export default function Home({
  cart,
  singleAdd,
  unViewItem,
  viewProduct,
  deleteItem,
  itemToView,
  viewItem,
  user }) {
  const [pizzasState, setPizzasState] = useState([])
  const router = useRouter()

  return (
    <>
      <main>
        {
          router.isReady ?
            <Pizzalist
              cart={cart}
              singleAdd={(e, piz) => singleAdd(e, piz)}
              viewItem={(e, i) => viewItem(e, i)}
              pizzas={pizzasState}
              setPizzas={setPizzasState}
              router={router}
            />
            : ''
        }
      </main>
    </>
  )
}

// export const getServerSideProps = async (context) => {
//   // console.log('GSSD... ', context.req.headers.cookie)ˇ
//   let pizzas
//   let error
//   await axios({
//     method: 'get',
//     url: `${server}/pizza/all`,
//     // url: `api/pizza/all`,
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       'Access-Control-Allow-Origin': `${server}`
//     },
//     params: context.query
//   })
//     .then(res => pizzas = res.data)
//     .catch(e => '')

//   console.log(context.query)
//   if (error) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/'
//       }
//     }
//   } else {
//     return {
//       props: {
//         pizzas
//       }
//     }
//   }
// }