import { server } from '../../config/config'
import CheckoutPizza from '../../components/cart/CheckoutPizza'
import axios from 'axios'

const checkout = ({ cartData }) => {
    console.log(cartData)
    return (
        <>
            <main>
                <section className='cart-items'>
                    {cartData.items.map(item => {
                        return <CheckoutPizza
                            item={item}
                            key={item._id}
                        />
                    })}
                    {cartData.totalCartPrice} CZK
                </section>
            </main>
        </>
    )
}

export const getServerSideProps = async (context) => {
    let error = false

    let cartData = {}

    const data = await axios({
        method: 'get',
        // url: `${server}/cart/getCartCheckout`,
        url: `/api/cart/getCartCheckout`,
        withCredentials: true,
        params: {
            cart: context.query.cart
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin': `${server}`,
            // Cookie: context.req.headers.cookie
        }
    })
        .then(res =>  cartData = res.data)
        .catch(e => {
            error = true
        })

    if (error) {
        return {
            redirect: {
                permanent: false,
                destination: "/cart",
            },
        }
    }

    return {
        props: {
            cartData
        }
    }

}

export default checkout