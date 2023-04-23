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
    const res = await axios({
        method: 'get',
        url: `/api2/payment/orders/${ordersId.slice(pageNumber * ordersPerPage, pageNumber * ordersPerPage + ordersPerPage)}`
    })
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

export async function fetchPaymentStatus(orderId, payId) {
    let res: any = await axios({
        method: 'get',
        url: `/api2/payment/check-status/${orderId}/${payId}`
    })
    const data = {
        paymentStatus: res.data?.paymentStatus,
        error: 0,
    }
    return data
}

export async function fetchOrder(payId) {
    const res = await axios({
        method: 'get',
        url: `/api2/payment/order/${payId}`,
        withCredentials: true,
        onDownloadProgress(progressEvent) {

        },
    })
    // console.log(res.data)
    const data = res.data
    return data
}