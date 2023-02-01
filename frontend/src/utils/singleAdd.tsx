import axios from 'axios'
import {server } from '../config/config'

export default async function singleAdd(e, piz) {
    e.stopPropagation()
    const productId = piz._id

    const res = await axios({
        method: 'post',
        url: `${server}/cart/singleAdd`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin': `${server}`
        },
        withCredentials: true,
        data: {
            productId
        }
    })
        .catch(e => window.location.href = '/')

    return res.data
}