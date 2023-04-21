import axios from "axios"

import { server } from "../../config/config"

export async function fetchPizzas(ingredients = "", searchParam = "") {
    const res = await axios({
        method: 'get',
        url: `${server}/pizza/all`,
        headers: {
            "Content-Type": "application/json",
        },
        params: {
            ingredients: ingredients,//router?.query?.ingredients,
            q: searchParam //router?.query?.q
        }
    })
    // console.log(res.data)
    return res.data
}

export async function fetchUserOrders(ordersId, pageNumber, ordersPerPage) {
    console.log(ordersId, pageNumber, ordersPerPage)
    const res = await axios({
        method: 'get',
        url: `/api2/payment/orders/${ordersId.slice(pageNumber * ordersPerPage, pageNumber * ordersPerPage + ordersPerPage)}`
    })
        // .then(res => {
        //     // console.log(res.data)
        //     // setOrdersLoaded(prev => {
        //     //     return [...prev, ...res.data.orders]
        //     // })
        // })
        // .catch(e => {
        //     console.error(e)
        // })
    // console.log(res.data)
    let data = {
        ...res.data,
        page: pageNumber,
        nextPage: pageNumber + 1,
    }
    if (pageNumber > 0) data.previousPage = pageNumber - 1
    return data
}

export async function fetchLangingPagePizzas() {
    const res = await axios({
        method: 'get',
        url: '/api2/pizza/get-many-number/7',
    })
    return res.data
}