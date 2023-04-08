import axios from 'axios'
import { server } from '../config/config'
import NProgress from 'nprogress'
import { setCookie, getCookie, getCookies, hasCookie } from 'cookies-next';

export default async function singleAdd(e, piz, totalCartPrice) {
    e.stopPropagation()
    const productId = piz._id
    let cartData: object

    await axios({
        method: 'post',
        // url: `${server}/cart/singleAdd`,
        url: `/api2/cart/singleAdd`,
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
        },
    })
        .then(res => {
            cartData = res.data
            totalCartPrice(res.data?.totalCartPrice)
        })
        .catch(e => console.error(e))

    if (cartData) {
        return cartData
    } else {
        throw Error('Something went wrong')
        window.location.replace('/')
    }
}