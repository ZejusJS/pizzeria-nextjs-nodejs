import axios from 'axios'
import { server } from '../config/config'

export default async function (e, qnt, item, setCart, setTotalCartPrice) {
    if (qnt === 'input') {
        qnt = e.target.value
        qnt = parseInt(qnt)
    }
    if (qnt === null || qnt === undefined || isNaN(qnt)) qnt = 1
    if (qnt > 15 || qnt < 1) {
        return false
    } else {
        setCart(prevCart => {
            prevCart.items = prevCart.items.map(it => {
                if (it?.item?._id !== item?.item?._id) return it
                return { ...it, quantity: qnt, totalPrice: qnt * it.item.price }
            })
            return { ...prevCart }
        })

        if (qnt) {
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
                    setTotalCartPrice(res.data?.totalCartPrice)
                })
                .catch(e => console.log(e))
        }
    }
}
