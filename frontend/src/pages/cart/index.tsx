import { useRouter } from 'next/router';
import Link from 'next/link';

import Item from '../../components/cart/CartPizza'
import Product from '../../components/pizza/Product';
import Unfocus from '../../components/Unfocus';
import Meta from '../../components/Meta'
import changeQntFunc from '../../utils/changeQnt';

import CartThinSvg from '../../images/CartThin'
import CartCheckoutSvg from '../../images/CartCheckout'
import WindSvg from '../../images/Wind'

const cart = ({ cart, setCart,
  viewItem, unViewItem,
  singleAdd, deleteItem,
  viewProduct, itemToView, user }) => {

  const router = useRouter()

  async function changeQnt(e, qnt, item) {
    changeQntFunc(e, qnt, item, setCart)
  }

  return (
    <>
    <Meta title='Mamma Mia | Cart' />
      {viewProduct ? <Unfocus onClick={(e) => unViewItem(e)} /> : ''}
      {viewProduct ?
        <Product
          onClick={(e) => unViewItem(e)}
          item={itemToView}
          cart={cart}
          deleteItem={(e, piz) => deleteItem(e, piz)}
          singleAdd={(e, piz) => singleAdd(e, piz)}
          user={user} />
        : ''}
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


// export async function getStaticProps(context) {
//   return {
//     props: {}, 
//   }
// }

export default cart