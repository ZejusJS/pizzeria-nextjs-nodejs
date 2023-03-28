import Link from "next/link"
import { useState } from "react"
import CartThinSvg from '../../images/CartThin'
import CartCheckoutSvg from '../../images/CartCheckout'
import WindSvg from '../../images/Wind'
import Item from "./CartPizza"

const Cart = ({ cart, deleteItem, viewItem, changeQnt, totalCartPrice }) => {
    const [loadingCartPrice, setLoadingCartPrice] = useState(false)

    function setQnt(e, item, qnt) {
        setLoadingCartPrice(true)
        changeQnt(e, item, qnt).then(res => {
            setLoadingCartPrice(false)
        })
    }

    return (
        <>
            {cart?.items?.length > 0
                ?
                <>
                    <section className='cart-items'>
                        {cart?.items?.map(item => {
                            return item.item ?
                                <Item
                                    deleteItem={deleteItem}
                                    changeQnt={(e, item, qnt) => setQnt(e, item, qnt)}
                                    item={item}
                                    key={item._id}
                                    viewItem={(e) => viewItem(e, item.item)}
                                />
                                :
                                ''
                        })}
                        <div className='checkout-btn-container'>
                            <div
                                className={`total-cart-price c-green fw-600 ${loadingCartPrice ? 'loading' : ''}`}
                            >
                                {totalCartPrice} CZK
                            </div>
                            <Link href={{
                                pathname: '/cart/checkout',
                                query: { cart: cart._id },
                            }}>
                                <div className='checkout-btn'>
                                    <div>
                                        Check out
                                    </div>
                                    <div className='svgs'>
                                        <WindSvg className='wind' />
                                        <CartCheckoutSvg className='cart' />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </section>
                </>
                :
                <div className='empty-cart'>
                    <CartThinSvg />
                    <p>Your cart is empty</p>
                </div>
            }
        </>
    )
}

export default Cart