import Head from 'next/head'
import Image from 'next/image'
import Meta from '../components/Meta'
import { server } from '../config/config'
import axios from "axios";
import Pizzalist from '@/components/pizza/Pizzalist';
import Navbar from '@/components/Navbar';
import React, { useState, useEffect } from 'react';

export default function Home({ pizzas }) {
  const [cart, setCart] = useState([])

  return (
    <>
      <Pizzalist pizzas={pizzas} />
    </>
  )
}

export const getStaticProps = async () => {
  const pizz = await axios({
    method: 'get',
    url: `${server}/pizza/all`
  })

  const pizzas = pizz.data

  return {
    props: {
      pizzas
    }
  }
}