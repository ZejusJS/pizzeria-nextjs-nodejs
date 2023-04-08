import axios from 'axios'
import { server } from '../config/config'
import NProgress from 'nprogress'

export default async function deleteItem(e, item, setTotalCartPrice) {
    e.stopPropagation()
    const productId = item._id
    let cartData

    await axios({
        method: 'post',
        url: `/api2/cart/deleteItem`,
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true,
        onUploadProgress: function (progressEvent) {
            if (e.target.classList.contains('add-to-cart')) e.target.classList.add('btn-cart-loading')
            // NProgress.start()
        },
        onDownloadProgress: function (progressEvent) {
            setTimeout(() => {
                if (e.target.classList.contains('add-to-cart')) e.target.classList.remove('btn-cart-loading')
            }, 150);
            // NProgress.done(false)
        },
        data: {
            productId
        }
    })
        .then(res => {
            cartData = res.data
            setTotalCartPrice(res.data?.totalCartPrice)
        })
        .catch(e => console.error(e))

    if (cartData) {
        return cartData
    } else {
        throw Error('Something went wrong')
        window.location.replace('/')
    }
}