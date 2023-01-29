import Head from 'next/head'
import Image from 'next/image'
import Meta from '../components/Meta'
import { server } from '../config/config'
import axios from "axios";
import Pizzalist from '../components/pizza/Pizzalist';
import Navbar from '../components/Navbar';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home({ pizzas }) {
  const [cart, setCart] = useState([])

  async function updateCart(e) {
    // console.log(e)
    const productId = e.target.getAttribute('data-id')
    console.log(productId)

    await axios({
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
  }

  return (
    <>
      <Pizzalist updtCart={updateCart} pizzas={pizzas} />
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

  const pizzas = pizz.data

  return {
    props: {
      pizzas
    }
  }
}