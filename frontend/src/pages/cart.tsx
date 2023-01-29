import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { server } from '../config/config'
import Item from '../components/cart/Item'

const cart = ({ cartData }) => {
  const [cart, setCart] = useState(cartData)

  async function changeQnt(e, qnt, item) {
    if (qnt === 'input') {
      qnt = e.target.value
      qnt = parseInt(qnt)
    }

    if (qnt > 15) {
      qnt = 15
    } else {
      setCart(prevCart => {
        prevCart.items = prevCart.items.map(it => {
          if (it.item._id !== item.item._id) return it
          return { ...it, quantity: qnt }
        })
        return { ...prevCart }
      })
      const data = await axios({
        method: 'post',
        url: `${server}/cart/changeQuantity`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Access-Control-Allow-Origin': `${server}`,
        },
        data: {
          quantity: qnt,
          productId: item.item._id
        },
        withCredentials: true
      })
    }
  }

  return (
    <main>
      <section className='cart-items'>
        {cart.items.map(item => {
          return <Item changeQnt={changeQnt} item={item} key={item._id} />
        })}
      </section>
    </main>
  )
}

export const getServerSideProps = async (context) => {
  const data = await axios({
    method: 'get',
    url: `${server}/cart/getCart`,
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Access-Control-Allow-Origin': `${server}`,
      Cookie: context.req.headers.cookie
    }
  })

  const cartData = data.data
  // console.log(cartData)

  return {
    props: {
      cartData
    }
  }
}


export default cart