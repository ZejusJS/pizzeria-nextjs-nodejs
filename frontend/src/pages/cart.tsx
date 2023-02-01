import axios from 'axios'
import { useEffect, useState } from 'react'
import { server } from '../config/config'
import Item from '../components/cart/Item'
import Product from '../components/pizza/Product';
import Unfocus from '../components/Unfocus';
import deleteItemFunc from '../utils/deleteItem'
import singleAddFunc from '../utils/singleAdd'
import changeQntFunc from '../utils/changeQnt';
import { useRouter } from 'next/router';

const cart = ({ cartData }) => {
  const [cart, setCart] = useState(cartData)
  const [viewProduct, setViewProduct] = useState(false)
  const [itemToView, setItemToView] = useState({})

  const router = useRouter()

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

  async function singleAdd(e, piz) {
    setCart(await singleAddFunc(e, piz))
  }

  async function deleteItem(e, piz) {
    setCart(await deleteItemFunc(e, piz))
  }

  async function changeQnt(e, qnt, item) {
    changeQntFunc(e, qnt, item, setCart)
  }

  return (
    <>
      {viewProduct ? <Unfocus onClick={unViewItem} /> : ''}
      {viewProduct ? <Product onClick={(e) => unViewItem(e)} item={itemToView} cart={cart} deleteItem={(e, piz) => deleteItem(e, piz)} singleAdd={(e, piz) => singleAdd(e, piz)} /> : ''}
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
      </main>
    </>
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