import axios from 'axios'
import { server } from '../config/config'

export default async function (e, qnt, item, setCart, setTotalCartPrice) {
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
            if (qnt > maxQnt) return { ...it, quantity: maxQnt, totalPrice: maxQnt * it.item.price }
            return { ...it, quantity: qnt, totalPrice: qnt * it.item.price }
        })
        return { ...prevCart }
    })

    if (!Number.isNaN(qnt) && qnt <= 15 && qnt >= 1) {
        let newQnt
        await axios({
            method: 'post',
            // url: `${server}/cart/changeQuantity`,
            url: `/api/cart/changeQuantity`,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': `${server}`,
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
            .catch(e => console.log(e))
    }
    return
}
