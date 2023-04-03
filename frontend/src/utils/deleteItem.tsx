import axios from 'axios'
import { server } from '../config/config'
import NProgress from 'nprogress'

export default async function deleteItem(e, item, setTotalCartPrice) {
    e.stopPropagation()
    const productId = item._id
    let cartData
    // console.log(productId)

    await axios({
        method: 'post',
        url: `/api/cart/deleteItem`,
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': `${server}`
        },
        withCredentials: true,
        onUploadProgress: function (progressEvent) {
            if (e.target.classList.contains('add-to-cart')) e.target.classList.add('btn-cart-loading')
            NProgress.start()
        },
        onDownloadProgress: function (progressEvent) {
            setTimeout(() => {
                if (e.target.classList.contains('add-to-cart')) e.target.classList.remove('btn-cart-loading')
            }, 150);
            NProgress.done(false)
        },
        data: {
            productId
        }
    })
        .then(res => {
            cartData = res.data
            setTotalCartPrice(res.data?.totalCartPrice)
        })
        .catch(e => console.log(e))

    if (cartData) {
        return cartData
    } else {
        window.location.replace('/')
    }
}