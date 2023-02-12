import { server } from '../../config/config'
import CheckoutPizza from '../../components/cart/CheckoutPizza'
import axios from 'axios'
import NProgress from 'nprogress'
import { useRef, useState, useEffect } from 'react'
import Signup from '../../components/auth/Signup'
import Order from '../../components/checkout/Order'

const checkout = ({ cartData, setUser, user, userData }) => {
    const [orderDetails, setOrderDetails] = useState({
        firstname: '',
        lastname: '',
        adress: '',
        city: '',
        zip: ''
    })

    // console.log(orderDetails)
    useEffect(() => {
        if (userData?.invoiceInfo?.adress) {
            setOrderDetails({
                firstname: userData.invoiceInfo.firstname,
                lastname: userData.invoiceInfo.lastname,
                adress: userData.invoiceInfo.adress,
                city: userData.invoiceInfo.city,
                zip: userData.invoiceInfo.zip
            })
        }
    }, [])

    const firstnameError = useRef(null)
    const lastnameError = useRef(null)
    const adressError = useRef(null)
    const cityError = useRef(null)
    const zipError = useRef(null)


    function handleChangeOrderDetails(e) {
        const { name, value } = e.target
        setOrderDetails(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
        if (name === 'firstname') {
            if (value.length < 1 || value.length > 30) {
                firstnameError?.current?.classList.add('shown')
            } else {
                firstnameError?.current?.classList.remove('shown')
            }
        }
        if (name === 'lastname') {
            if (value.length < 1 || value.length > 30) {
                lastnameError?.current?.classList.add('shown')
            } else {
                lastnameError?.current?.classList.remove('shown')
            }
        }
        if (name === 'adress') {
            if (value.length < 1 || value.length > 50) {
                adressError?.current?.classList.add('shown')
            } else {
                adressError?.current?.classList.remove('shown')
            }
        }
        if (name === 'city') {
            if (value.length < 1 || value.length > 50) {
                cityError?.current?.classList.add('shown')
            } else {
                cityError?.current?.classList.remove('shown')
            }
        }
        if (name === 'zip') {
            if (value.length < 1 || value.length > 16) {
                zipError?.current?.classList.add('shown')
            } else {
                zipError?.current?.classList.remove('shown')
            }
        }
    }

    // console.log(userData)

    const [index, setIndex] = useState(0)

    const slide1 = useRef(null)
    const slide2 = useRef(null)
    const slide3 = useRef(null)

    const slides = [slide1, slide2, slide3]

    function changeSlide(e) {
        const prevIndex = index
        setIndex(e.target.name)
        slides[e.target.name].current.classList.add('shown')
        if (!(e.target.name === prevIndex)) {
            slides[prevIndex].current.classList.remove('shown')
        }
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
                {/* <form action="/api/payment/signature" method='post'>
                    <button type="submit">Submit</button>
                </form> */}
                {!user?.email ?
                    <Signup
                        setUser={setUser}
                        setOrderDetails={setOrderDetails}
                    />
                    :
                    <>
                        <div className='slides-container'>
                            <div>
                                <button
                                    name='0'
                                    onClick={changeSlide}
                                    className='change-slide'
                                >
                                    1. Order Details
                                </button>
                                <button
                                    name='1'
                                    onClick={changeSlide}
                                    className='change-slide'
                                >
                                    2. Shipping
                                </button>
                                <button
                                    name='2'
                                    onClick={changeSlide}
                                    className='change-slide'
                                >
                                    3. Payment
                                </button>
                            </div>
                            <section className='order-section'>
                                <div
                                    className='slide-item shown'
                                    ref={slide1}
                                >
                                    <Order
                                        orderDetails={orderDetails}
                                        adressError={adressError}
                                        cityError={cityError}
                                        zipError={zipError}
                                        handleChange={handleChangeOrderDetails}
                                        firstnameError={firstnameError}
                                        lastnameError={lastnameError}
                                    />
                                </div>
                                <div
                                    className='slide-item'
                                    ref={slide2}
                                >
                                    <p>Shipping</p>
                                </div>
                                <div
                                    className='slide-item'
                                    ref={slide3}
                                >
                                    <p>Payment</p>
                                </div>
                            </section>
                        </div>
                    </>
                }
            </main>
        </>
    )
}

export const getServerSideProps = async (context) => {
    let error = false

    let cartData = {}
    let userData = {}

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
            Cookie: context.req.headers.cookie
        }
    })
        .then(res => cartData = res.data)
        .catch(e => {
            error = true
        })

    await axios({
        method: 'get',
        url: `${server}/user/getUser`,
        // url: `api/cart/getCartAndUser`,
        withCredentials: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin': `${server}`,
            Cookie: context.req.headers.cookie
        }
    })
        .then(res => userData = res.data)
        .catch(e => {
            userData = {}
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
            cartData,
            userData
        }
    }

}

export default checkout