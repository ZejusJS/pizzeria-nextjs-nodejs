import Head from 'next/head'
import Image from 'next/image'
import Meta from '../components/Meta'
import { server } from '../config/config'
import axios from "axios";
import Pizzalist from '@/components/Pizzalist';

export default function Home({ pizzas }) {
  return (
    <>
      <main>
        <Pizzalist pizzas={pizzas} />
      </main>
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