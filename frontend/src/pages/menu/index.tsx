import axios from "axios";
import {
  useQuery,
  Hydrate,
  QueryClient,
  dehydrate
} from "@tanstack/react-query";

import Meta from '../../components/Meta'
import { server } from '../../config/config'
import Pizzalist from '../../components/pizza/Pizzalist';
import { fetchPizzas } from "../../utils/fetch";
import { useState } from "react";

function usePizzas(ingredients: any, searchParam: any) {
  if (!ingredients) ingredients = ""
  if (!searchParam) searchParam = ""
  return useQuery({
    queryKey: ["pizzas", String(ingredients), String(searchParam)],
    queryFn: async (obj) => {
      return await fetchPizzas(ingredients, searchParam)
    },
    staleTime: 1000 * 60 * 100
  });
}

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
  dehydratedState,
  queryClient }) {

  return (
    <>
      <Meta
        title="Mamma Mia | Menu"
      />
      <main>
        <Hydrate state={dehydratedState}>
          {
            router.isReady ?
              <Pizzalist
                cart={cart}
                singleAdd={(e, piz) => singleAdd(e, piz)}
                deleteItem={(e, piz) => deleteItem(e, piz)}
                viewItem={(e, i) => viewItem(e, i)}
                // pizzas={pizzasQuery}
                router={router}
              // isFetching={isFetching}
              // refetch={refetch}
              />
              : ''
          }
        </Hydrate>
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

  // if (isFirstServerCall) {
  //   await axios({
  //     method: 'get',
  //     url: `${server}/pizza/all`,
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       'Access-Control-Allow-Origin': `${server}`
  //     },
  //     params: context.query
  //   })
  //     .then(res => {
  //       // console.log(res.data)
  //       pizzas = res.data
  //     })
  //     .catch(e => {
  //       error = true
  //     })
  // } else {
  //   pizzas = null
  // }

  if (!isFirstServerCall) {
    return {
      props: {
        
      }
    }
  }

  const queryClient = new QueryClient()

  let ingredients = context.query.ingredients || ""
  let searchParam = context.query.q || ""

  await queryClient.prefetchQuery(['pizzas', ingredients, searchParam],
    () => fetchPizzas(ingredients, searchParam))

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
        dehydratedState: dehydrate(queryClient)
      }
    }
  }
}