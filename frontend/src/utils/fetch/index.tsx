import axios from "axios"

import { server } from "../../config/config"

export async function fetchPizzas(ingredients, searchParam) {
    if (!ingredients) ingredients = ''
    if (!searchParam) searchParam = ''
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

export async function fetchLangingPagePizzas() {
    const res = await axios({
        method: 'get',
        url: '/api2/pizza/get-many-number/7',
    })
    return res.data
}