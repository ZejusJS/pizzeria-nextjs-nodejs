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
                            viewItem={(e) => viewItem(e, item.item)}
                        />
                    })}
                </section>
            </main>
        </>
    )
}

export const getServerSideProps = async (context) => {
    const data = await axios({
        method: 'get',
        url: `${server}/cart/getCart`,
        withCredentials: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin': `${server}`,
            Cookie: context.req.headers.cookie
        }
    })

    const cartData = data.data
    // console.log(cartData)

    return {
        props: {
            cartData
        }
    }
}

export default checkout