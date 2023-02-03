import axios from 'axios'
import { server } from '../config/config'

export default async function deleteItem(e, item) {
    e.stopPropagation()
    const productId = item._id
    let cartData

    await axios({
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
        .then(res => cartData = res.data)
        .catch(e => console.log(e))

    if (cartData) {
        return cartData
    } else {
        window.location.replace('/')
    }
}