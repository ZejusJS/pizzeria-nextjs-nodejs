import Head from 'next/head'
import Image from 'next/image'
import Meta from '../components/Meta'
import { server } from '../config/config'
import axios from "axios";
import Pizzalist from '../components/pizza/Pizzalist';
import { useState } from 'react';
import Product from '../components/pizza/Product';
import Unfocus from '../components/Unfocus';

export default function Home({
  pizzas,
  setCart,
  cart,
  singleAdd,
  unViewItem,
  viewProduct,
  deleteItem,
  itemToView,
  viewItem,
  user }) {
  const [pizzasState, setPizzasState] = useState(pizzas)

  return (
    <>
      {viewProduct ? <Unfocus onClick={unViewItem} /> : ''}
      {viewProduct ? <Product
        onClick={(e) => unViewItem(e)}
        item={itemToView}
        cart={cart}
        deleteItem={(e, piz) => deleteItem(e, piz)}
        singleAdd={(e, piz) => singleAdd(e, piz)}
        user={user} /> : ''}
      <main>
        <Pizzalist
          cart={cart}
          singleAdd={(e, piz) => singleAdd(e, piz)}
          viewItem={(e, i) => viewItem(e, i)}
          pizzas={pizzasState}
          setPizzas={setPizzasState}
           />
      </main>
    </>
  )
}

export const getServerSideProps = async (context) => {
  // console.log('GSSD... ', context.req.headers.cookie)ˇ
  let pizzas
  let error
  await axios({
    method: 'get',
    url: `${server}/pizza/all`,
    // url: `api/pizza/all`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Access-Control-Allow-Origin': `${server}`
    },
    params: context.query
  })
    .then(res => pizzas = res.data)
    .catch(e => '')

  console.log(context.query)
  if (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  } else {
    return {
      props: {
        pizzas
      }
    }
  }
}