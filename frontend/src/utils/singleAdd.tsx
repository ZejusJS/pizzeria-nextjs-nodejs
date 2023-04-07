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
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': `${server}`
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
        .catch(e => console.log(e))

    if (cartData) {
        return cartData
    } else {
        window.location.replace('/')
    }
}