import axios from 'axios'
import { server } from '../config/config'
import NProgress from 'nprogress'

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
        onUploadProgress: function (progressEvent) {
            e.target.classList.add('btn-cart-loading')
            NProgress.start()
        },
        onDownloadProgress: function (progressEvent) {
            e.target.classList.remove('btn-cart-loading')
            NProgress.done(false)
        },
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