import axios from 'axios'
import { server } from '../config/config'
import NProgress from 'nprogress'
import { setCookie, getCookie, getCookies, hasCookie } from 'cookies-next';

export default async function singleAdd(e, piz) {
    e.stopPropagation()
    const productId = piz._id
    let cartData

    await axios({
        method: 'post',
        // url: `${server}/cart/singleAdd`,
        url: `/api/cart/singleAdd`,
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': `${server}`
        },
        withCredentials: true,
        onUploadProgress: function (progressEvent) {
            e.target.classList.add('btn-cart-loading')
            NProgress.start()
        },
        onDownloadProgress: function (progressEvent) {
            setTimeout(() => {
                e.target.classList.remove('btn-cart-loading')
            }, 150);
            NProgress.done(false)
        },
        data: {
            productId
        },
    })
        .then(res => cartData = res.data)
        .catch(e => console.log(e))

    if (cartData) {
        return cartData
    } else {
        window.location.replace('/')
    }
}