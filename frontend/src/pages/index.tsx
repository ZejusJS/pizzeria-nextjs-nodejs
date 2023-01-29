import Head from 'next/head'
import Image from 'next/image'
import Meta from '../components/Meta'
import { server } from '../config/config'
import axios from "axios";
import Pizzalist from '../components/pizza/Pizzalist';
import Navbar from '../components/Navbar';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Product from '../components/pizza/Product';
import Unfocus from '../components/Unfocus';

export default function Home({ pizzas, cartData }) {
  const [cart, setCart] = useState(cartData)
  const [viewProduct, setViewProduct] = useState(false)
  const [itemToView, setItemToView] = useState({})

  async function updateCart(e, piz) {
    // console.log(e)
    // console.log(piz)
    const productId = piz._id
    // console.log(productId)

    const newCart = await axios({
      method: 'post',
      url: `${server}/cart/singleAdd`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Access-Control-Allow-Origin': `${server}`
      },
      withCredentials: true,
      data: {
        productId
      }
    })
    // setCart(prevCart => {
    //   prevCart.items = prevCart.items.map(it => {
    //     if (it.item._id !== productId) return it
    //     return { ...it, quantity: it.quantity + 1 }
    //   })
    //   return { ...prevCart }
    // })

    console.log(newCart.data)
    setCart(newCart.data)
  }

  async function deleteItem(e, item) {
    const productId = item._id

    const res = await axios({
      method: 'delete',
      url: `${server}/cart/deleteItem`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Access-Control-Allow-Origin': `${server}`
      },
      withCredentials: true,
      data: {
        productId
      }
    })

    setCart(res.data)
  }

  console.log('Cart.... ', cart)
  console.log('Item.... ', itemToView)

  function viewItem(e, item) {
    setItemToView(item)
    setViewProduct(true)
  }

  function unViewItem() {
    setItemToView({})
    setViewProduct(false)
  }

  return (
    <>
      {viewProduct ? <Unfocus onClick={unViewItem} /> : ''}
      {viewProduct ? <Product item={itemToView} cart={cart} deleteItem={(e, piz) => deleteItem(e, piz)} updateCart={(e, piz) => updateCart(e, piz)} /> : ''}
      <Pizzalist
        updtCart={(e, piz) => updateCart(e, piz)}
        viewItem={(e, i) => viewItem(e, i)}
        pizzas={pizzas} />
    </>
  )
}

export const getServerSideProps = async (context) => {
  // console.log('GSSD... ', context.req.headers.cookie)
  const pizz = await axios({
    method: 'get',
    url: `${server}/pizza/all`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Access-Control-Allow-Origin': `${server}`
    }
  })

  const cart = await axios({
    method: 'get',
    url: `${server}/cart/getCart`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Access-Control-Allow-Origin': `${server}`,
      Cookie: context.req.headers.cookie
    }
  })

  const cartData = cart.data

  const pizzas = pizz.data

  return {
    props: {
      pizzas,
      cartData
    }
  }
}