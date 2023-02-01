import axios from 'axios'
import {server } from '../config/config'

export default async function deleteItem(e, item) {
    const productId = item._id
    e.stopPropagation()

    const res = await axios({
        method: 'delete',
        url: `${server}/cart/deleteItem`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin': `${server}`
        },
        withCredentials: true,
        data: {
            productId
        }
    })

    // console.warn(res.data)
    // setCart(res.data)
    return res.data
}