import Head from 'next/head'
import Image from 'next/image'
import Meta from '../components/Meta'
import { server } from '../config/config'
import axios from "axios";
import Pizzalist from '../components/pizza/Pizzalist';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Product from '../components/pizza/Product';
import Unfocus from '../components/Unfocus';
import deleteItemFunc from '../utils/deleteItem'
import singleAddFunc from '../utils/singleAdd'

export default function Home({ pizzas, cartData }) {
  const [cart, setCart] = useState(cartData)
  const [viewProduct, setViewProduct] = useState(false)
  const [itemToView, setItemToView] = useState({})

  // async function updateCart(e, piz) {
  //   e.stopPropagation()
  //   const productId = piz._id

  //   await axios({
  //     method: 'post',
  //     url: `${server}/cart/singleAdd`,
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       'Access-Control-Allow-Origin': `${server}`
  //     },
  //     withCredentials: true,
  //     data: {
  //       productId
  //     }
  //   })
  //     .then(res => setCart(res.data))
  //     .catch(e => window.location.href = '/')
  // }

  async function singleAdd(e, piz) {
    setCart(await singleAddFunc(e, piz))
  }

  async function deleteItem(e, piz) {
    setCart(await deleteItemFunc(e, piz))
  }

  // console.log('Cart.... ', cart)
  // console.log('Item.... ', itemToView)

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

import * as cookie from 'cookie'

export const getServerSideProps = async (context) => {
  // console.log('GSSD... ', context.req.headers.cookie)ˇ
  let cartData
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

  await axios({
    method: 'get',
    url: `${server}/cart/getCart`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Access-Control-Allow-Origin': `${server}`,
      Cookie: context.req.headers.cookie
    }
  })
    .then(res => cartData = res.data)
    .catch(e => {
      const res = e.response.data
      context.res.setHeader('Set-Cookie', cookie.serialize('cart', res.cart, {
        httpOnly: true
      }));
      error = true
    })

    if(error) {
      return {
        redirect: {
          permanent: false,
          destination: '/'
        }
      }
    } else {
      return {
        props: {
          pizzas,
          cartData
        }
      }
    }
}