import axios from 'axios'
import { server } from '../config/config'

export default async function (e, qnt, item, setCart) {
    if (qnt === 'input') {
        qnt = e.target.value
        qnt = parseInt(qnt)
    }
    if (qnt > 15) {
        return false
    } else if (qnt < 1) {
        return false
    } else {
        setCart(prevCart => {
            prevCart.items = prevCart.items.map(it => {
                if (it.item._id !== item.item._id) return it
                return { ...it, quantity: qnt }
            })
            return { ...prevCart }
        })
        return await axios({
            method: 'post',
            url: `${server}/cart/changeQuantity`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Access-Control-Allow-Origin': `${server}`,
            },
            data: {
                quantity: qnt,
                productId: item.item._id
            },
            withCredentials: true
        })
    }
}
