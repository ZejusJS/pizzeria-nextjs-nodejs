import axios from "axios"

import { server } from "../../config/config"

export async function fetchPizzas(ingredients, searchParam) {
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
    return res.data
}