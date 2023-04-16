import Meta from '../../components/Meta'
import { server } from '../../config/config'
import axios from "axios";
import Pizzalist from '../../components/pizza/Pizzalist';
import { useEffect, useState } from 'react';

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
  const [pizzasState, setPizzasState] = useState(pizzas)

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
              pizzas={pizzasState}
              setPizzas={setPizzasState}
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
    .catch(e => '')

  // console.log(context.query)
  if (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  } else {
    return {
      props: {
        pizzas
      }
    }
  }
}