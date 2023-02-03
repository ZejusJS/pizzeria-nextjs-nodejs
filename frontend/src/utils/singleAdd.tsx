import axios from 'axios'
import { server } from '../config/config'

export default async function singleAdd(e, piz) {
    e.stopPropagation()
    const productId = piz._id
    let cartData

    await axios({
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
        .then(res => cartData = res.data)
        .catch(e => console.log(e))

    if (cartData) {
        return cartData
    } else {
        window.location.replace('/')
    }
}