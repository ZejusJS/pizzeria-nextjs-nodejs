import { useRouter } from 'next/router';
import Link from 'next/link';

import Item from '../../components/cart/CartPizza'
import Product from '../../components/pizza/Product';
import Unfocus from '../../components/Unfocus';
import changeQntFunc from '../../utils/changeQnt';

import CartThinSvg from '../../images/CartThin'

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
        {cart?.items?.length > 0
          ?
          <>
            <section className='cart-items'>
              {cart?.items?.map(item => {
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