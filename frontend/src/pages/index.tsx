import Head from 'next/head'
import Image from 'next/image'
import Meta from '../components/Meta'
import { server } from '../config/config'
import axios from "axios";
import Pizzalist from '../components/pizza/Pizzalist';
import Navbar from '../components/Navbar';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Product from '../components/pizza/Product';
import Unfocus from '../components/Unfocus';
import deleteItemFunc from '../utils/deleteItem'
import singleAddFunc from '../utils/singleAdd'

export default function Home({ pizzas, setCart, cart }) {

  const [viewProduct, setViewProduct] = useState(false)
  const [itemToView, setItemToView] = useState({})

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
      {viewProduct ? <Unfocus onClick={unViewItem} /> : ''}
      {viewProduct ? <Product
        onClick={(e) => unViewItem(e)}
        item={itemToView}
        cart={cart}
        deleteItem={(e, piz) => deleteItem(e, piz)}
        singleAdd={(e, piz) => singleAdd(e, piz)} /> : ''}
      <main>
        <Pizzalist
          cart={cart}
          singleAdd={(e, piz) => singleAdd(e, piz)}
          viewItem={(e, i) => viewItem(e, i)}
          pizzas={pizzas} />
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
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Access-Control-Allow-Origin': `${server}`
    }
  })
    .then(res => pizzas = res.data)
    .catch(e => '')

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