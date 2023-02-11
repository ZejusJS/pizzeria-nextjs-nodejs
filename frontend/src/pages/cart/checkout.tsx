import { server } from '../../config/config'
import CheckoutPizza from '../../components/cart/CheckoutPizza'
import axios from 'axios'
import NProgress from 'nprogress'
import { useState } from 'react'

const checkout = ({ cartData }) => {
    const [signData, setSignData] = useState({
        name: '',
        email: '',
        password: ''
    })

    console.log(cartData)
    
    async function handleSignUp(e) {
        axios.defaults.withCredentials = true
        e.stopPropagation()
        e.preventDefault()

        await axios({
            method: 'post',
            url: `/api/user/signup`,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': `${server}`
            },
            onUploadProgress: function (progressEvent) {
                NProgress.start()
            },
            onDownloadProgress: function (progressEvent) {
                NProgress.done(false)
            },
            data: signData
        })
            .then(res => {
                console.log(res)
                window.location.href = "/"
            })
            .catch(e => console.log(e))
    }

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
                <form action="/api/payment/signature" method='post'>
                    <button type="submit">Submit</button>
                </form>
            </main>
        </>
    )
}

export const getServerSideProps = async (context) => {
    let error = false

    let cartData = {}

    await axios({
        method: 'get',
        url: `${server}/cart/getCartCheckout`,
        // url: `/api/cart/getCartCheckout`,
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