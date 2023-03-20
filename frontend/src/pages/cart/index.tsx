import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

import Item from '../../components/cart/CartPizza'
import Meta from '../../components/Meta'
import changeQntFunc from '../../utils/changeQnt';

import CartThinSvg from '../../images/CartThin'
import CartCheckoutSvg from '../../images/CartCheckout'
import WindSvg from '../../images/Wind'

const cart = ({ cart, setCart,
  viewItem, fetchFirstData,
  totalCartPrice, setTotalCartPrice }) => {

  const [loadingCartPrice, setLoadingCartPrice] = useState(false)

  const router = useRouter()

  if (router?.query?.empty === 'true') {
    console.log(router?.query?.empty)
    router.replace({
      pathname: router.pathname,
      query: {}
    }, '', { shallow: true }).then(
      fetchFirstData()
    )
  }

  async function changeQnt(e, qnt, item) {
    setLoadingCartPrice(true)
    await changeQntFunc(e, qnt, item, setCart, setTotalCartPrice)
    setLoadingCartPrice(false)
  }

  return (
    <>
      <Meta title='Mamma Mia | Cart' />
      <main>
        {cart?.items?.length > 0
          ?
          <>
            <section className='cart-items'>
              {cart?.items?.map(item => {
                return item.item ?
                  <Item
                    changeQnt={(e, item, qnt) => changeQnt(e, item, qnt)}
                    item={item}
                    key={item._id}
                    viewItem={(e) => viewItem(e, item.item)}
                  />
                  :
                  ''
              })}
              <div className='checkout-btn-container'>
                <div
                  className={`total-cart-price c-green fw-600 ${loadingCartPrice ? 'loading' : ''}`}
                >
                  {totalCartPrice} CZK
                </div>
                <Link href={{
                  pathname: '/cart/checkout',
                  query: { cart: cart._id },
                }}>
                  <div className='checkout-btn'>
                    <div>
                      Check out
                    </div>
                    <div className='svgs'>
                      <WindSvg className='wind' />
                      <CartCheckoutSvg className='cart' />
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          </>
          :
          <div className='empty-cart'>
            <CartThinSvg />
            <p>Your cart is empty</p>
          </div>
        }

      </main>
    </>
  )
}

// import * as cookie from 'cookie'

// export const getServerSideProps = async (context) => {
//   return {
//     props: {
//       '1': 1
//     }
//   }
// }

export default cart