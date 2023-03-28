import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

import Item from '../../components/cart/CartPizza'
import Meta from '../../components/Meta'
import changeQntFunc from '../../utils/changeQnt';
import Cart from '../../components/cart/Cart';

const cart = ({ cart,
  viewItem, fetchFirstData,
  totalCartPrice, deleteItem, changeQnt }) => {

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

  return (
    <>
      <Meta title='Mamma Mia | Cart' />
      <main>
        <Cart 
        cart={cart} 
        deleteItem={deleteItem} 
        viewItem={viewItem} 
        changeQnt={changeQnt} 
        totalCartPrice={totalCartPrice}        
        />
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