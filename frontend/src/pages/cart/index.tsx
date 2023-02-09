import axios from 'axios'
import { useEffect, useState } from 'react'
import { server } from '../../config/config'
import Item from '../../components/cart/CartPizza'
import Product from '../../components/pizza/Product';
import Unfocus from '../../components/Unfocus';
import deleteItemFunc from '../../utils/deleteItem'
import singleAddFunc from '../../utils/singleAdd'
import changeQntFunc from '../../utils/changeQnt';
import { useRouter } from 'next/router';
import Link from 'next/link';

const cart = ({ cart, setCart,
  viewItem, unViewItem,
  singleAdd, deleteItem,
  viewProduct, itemToView }) => {

  const router = useRouter()

  async function changeQnt(e, qnt, item) {
    changeQntFunc(e, qnt, item, setCart)
  }

  return (
    <>
      {viewProduct ? <Unfocus onClick={(e) => unViewItem(e)} /> : ''}
      {viewProduct ?
        <Product
          onClick={(e) => unViewItem(e)}
          item={itemToView}
          cart={cart}
          deleteItem={(e, piz) => deleteItem(e, piz)}
          singleAdd={(e, piz) => singleAdd(e, piz)} />
        : ''}
      <main>
        <section className='cart-items'>
          {cart.items.map(item => {
            return <Item
              changeQnt={(e, item, qnt) => changeQnt(e, item, qnt)}
              item={item}
              key={item._id}
              viewItem={(e) => viewItem(e, item.item)}
            />
          })}
        </section>
        <Link href={{
          pathname: '/cart/checkout',
          query: { cart: cart._id },
        }}>
          Check out
        </Link>
      </main>
    </>
  )
}

import * as cookie from 'cookie'

export const getServerSideProps = async (context) => {
  return {
    props: {
      '1': 1
    }
  }
}



export default cart