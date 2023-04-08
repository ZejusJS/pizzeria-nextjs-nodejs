import axios from 'axios'
import { server } from '../config/config'

export default async function (e, qnt, item, setCart, setTotalCartPrice, setProductError, setProductErrorText) {
    let minQnt = 1
    let maxQnt = 15
    if (qnt === 'input') {
        qnt = e.target.value
        qnt = Math.floor(Number(qnt))
    }

    setCart(prevCart => {
        prevCart.items = prevCart.items.map(it => {
            if (it?.item?._id !== item?.item?._id) return it
            if (Number.isNaN(qnt) || qnt < minQnt) return { ...it, quantity: 0, totalPrice: 1 * it.item.price }
            if (qnt > maxQnt) return { ...it, quantity: maxQnt, totalPrice: (maxQnt * it.item.price).toFixed(2) }
            return { ...it, quantity: qnt, totalPrice: (qnt * it.item.price).toFixed(2) }
        })
        return { ...prevCart }
    })

    if (!Number.isNaN(qnt) && qnt <= 15 && qnt >= 1) {
        let newQnt
        await axios({
            method: 'post',
            // url: `${server}/cart/changeQuantity`,
            url: `/api2/cart/changeQuantity`,
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                quantity: qnt,
                productId: item.item._id
            },
            withCredentials: true
        })
            .then(res => {
                newQnt = res.data
                if (res.data?.totalCartPrice) setTotalCartPrice(res.data.totalCartPrice)
            })
            .catch(e => {
                if (e?.response?.data?.code === 300 && e?.response?.data?.cart) {
                    console.log(e?.response?.data?.cart)
                    if (e?.response?.data?.codeE === 1) {
                        setProductErrorText('Product was no longer available')
                    } else if (e?.response?.data?.codeE === 2) {
                        setProductErrorText('Product was no longer in your cart')
                    }
                    setCart(e.response.data.cart)
                    setProductError(e?.response?.data?.codeE)
                    setTimeout(() => {
                        setProductError(0)
                    }, 3000);
                }
                console.error(e)
            })
    }
    return
}
