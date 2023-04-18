import Meta from '../../components/Meta'
import { server } from '../../config/config'
import axios from "axios";
import Pizzalist from '../../components/pizza/Pizzalist';
import { useState } from 'react';

export default function Home({
  cart,
  singleAdd,
  unViewItem,
  viewProduct,
  deleteItem,
  itemToView,
  viewItem,
  user,
  router,
  pizzas }) {
  // const [pizzasState, setPizzasState] = useState(pizzas)

  return (
    <>
      <Meta
        title="Mamma Mia | Menu"
      />
      <main>
        {
          router.isReady ?
            <Pizzalist
              cart={cart}
              singleAdd={(e, piz) => singleAdd(e, piz)}
              deleteItem={(e, piz) => deleteItem(e, piz)}
              viewItem={(e, i) => viewItem(e, i)}
              // pizzas={pizzasState}
              // setPizzas={setPizzasState}
              router={router}
            />
            : ''
        }
      </main>
    </>
  )
}

export const getServerSideProps = async (context) => {
  // console.log('GSSD... ', context.req.headers.cookie)ˇ
  let pizzas
  let error: boolean

  const isFirstServerCall = context?.req?.url?.indexOf('/_next/data/') === -1
  console.log(isFirstServerCall)

  if (isFirstServerCall) {
    await axios({
      method: 'get',
      url: `${server}/pizza/all`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Access-Control-Allow-Origin': `${server}`
      },
      params: context.query
    })
      .then(res => {
        // console.log(res.data)
        pizzas = res.data
      })
      .catch(e => {
        error = true
      })
  } else {
    pizzas = null
  }

  // console.log(context.query)
  if (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  } else {
    context.res.setHeader(
      'Cache-Control',
      'public, s-maxage=30, stale-while-revalidate=100'
    )

    // console.log(pizzas)
    return {
      props: {
        pizzas
      }
    }
  }
}