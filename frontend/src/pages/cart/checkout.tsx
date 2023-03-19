import { server } from '../../config/config'
import CheckoutPizza from '../../components/cart/CheckoutPizza'
import axios from 'axios'
import { useRef, useState, useEffect } from 'react'
import Signup from '../../components/auth/Signup'
import Login from '../../components/auth/Login'
import Order from '../../components/checkout/Order'
import Shipping from '../../components/checkout/Shipping'
import PaymentMethods from '../../components/checkout/PaymentMethods'
import Meta from '../../components/Meta'

import MasterCardLogo from '../../images/MasterCardLogo'
import VisaCardLogo from '../../images/VisaCardLogo'
import HouseAdressSvg from '../../images/Houseadress'
import DollarSvg from '../../images/Dollar'
import ShippingSvg from '../../images/Box'
import ArrowRightSvg from '../../images/ArrowRight'

const checkout = ({ cartData, setUser, user, userData, setCart }) => {
    const [orderDetails, setOrderDetails] = useState({
        firstname: '',
        lastname: '',
        adress: '',
        city: '',
        zip: ''
    })
    const [shipping, setShipping] = useState({ name: 'standard', price: 70 })
    const [paymentMethod, setPaymentMethod] = useState({ name: 'card', price: 0 })
    const [totalPrice, setTotalPrice] = useState(0)
    const [auth, setAuth] = useState(0)
    const [error, setError] = useState(false)

    // console.log(orderDetails)
    const invoiceInfo = userData.invoiceInfo
    const shippingAdress = userData.shippingAdress
    useEffect(() => {
        if (userData?.invoiceInfo?.adress) {
            setOrderDetails({
                firstname: shippingAdress.firstname?.length ? shippingAdress.firstname : invoiceInfo.firstname,
                lastname: shippingAdress.lastname?.length ? shippingAdress.lastname : invoiceInfo.lastname,
                adress: shippingAdress.adress?.length ? shippingAdress.adress : invoiceInfo.adress,
                city: shippingAdress.city?.length ? shippingAdress.city : invoiceInfo.city,
                zip: shippingAdress.zip?.length ? shippingAdress.zip : invoiceInfo.zip
            })
        }
    }, [])

    useEffect(() => {
        setTotalPrice(paymentMethod.price + shipping.price + cartData.totalCartPrice)
    }, [shipping, paymentMethod, orderDetails, cartData])

    const firstnameError = useRef(null)
    const lastnameError = useRef(null)
    const adressError = useRef(null)
    const cityError = useRef(null)
    const zipError = useRef(null)

    function handleChangeOrderDetails(e) {
        setError(false)

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

            if (value.match(/[^\sa-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06\u00bf\u00a1]/gi)) {
                firstnameError?.current?.classList.add('second-shown')
            } else {
                firstnameError?.current?.classList.remove('second-shown')
            }
        }
        if (name === 'lastname') {
            if (value.length < 1 || value.length > 30) {
                lastnameError?.current?.classList.add('shown')
            } else {
                lastnameError?.current?.classList.remove('shown')
            }

            if (value.match(/[^\sa-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06\u00bf\u00a1]/gi)) {
                lastnameError?.current?.classList.add('second-shown')
            } else {
                lastnameError?.current?.classList.remove('second-shown')
            }
        }
        if (name === 'adress') {
            if (value.length < 1 || value.length > 50) {
                adressError?.current?.classList.add('shown')
            } else {
                adressError?.current?.classList.remove('shown')
            }

            if (value.match(/[^\sa-zA-Z0-9\+\_\-\@\&\=\.\,\(\)\:\ \/\?\|\<\>\"\'\!\%\*\\\#\$\^\;\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06]/gi)) {
                adressError?.current?.classList.add('second-shown')
            } else {
                adressError?.current?.classList.remove('second-shown')
            }
        }
        if (name === 'city') {
            if (value.length < 1 || value.length > 50) {
                cityError?.current?.classList.add('shown')
            } else {
                cityError?.current?.classList.remove('shown')
            }

            if (value.match(/[^\sa-zA-Z0-9\+\_\-\@\&\=\.\,\(\)\:\ \/\?\|\<\>\"\'\!\%\*\\\#\$\^\;\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06]/gi)) {
                cityError?.current?.classList.add('second-shown')
            } else {
                cityError?.current?.classList.remove('second-shown')
            }
        }
        if (name === 'zip') {
            if (value.length < 1 || value.length > 16) {
                zipError?.current?.classList.add('shown')
            } else {
                zipError?.current?.classList.remove('shown')
            }

            if (value.match(/[^\sa-zA-Z0-9\+\_\-\@\&\=\.\,\(\)\:\ \/\?\|\<\>\"\'\!\%\*\\\#\$\^\;\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06]/gi)) {
                zipError?.current?.classList.add('second-shown')
            } else {
                zipError?.current?.classList.remove('second-shown')
            }
        }
    }

    function handleShipping(e) {
        let price = 0
        if (e.target.value === 'standard') price = 70
        if (e.target.value === 'fast') price = 90
        setShipping({ name: e.target.value, price })
    }

    function handlePaymentMethod(e) {
        let price = 0
        if (e.target.value === 'card') price = 0
        setPaymentMethod({ name: e.target.value, price })
    }

    function handleSubmit(e) {
        const orderData = {
            ...orderDetails,
            shipping: shipping.name,
            paymentMethod: paymentMethod.name,
            cartData: {
                items: cartData.items,
                _id: cartData._id
            }
        }
        console.log(orderData)

        axios({
            method: 'post',
            url: '/api/payment/card',
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': `${server}`
            },
            data: orderData
        })
            .then(res => {
                window.location.href = res.data.url
            })
            .catch(e => {
                console.error(e)
                setError(true)
            })
    }

    // console.log(userData)

    const [index, setIndex] = useState(0)

    const slideSection = useRef(null)
    const slide1 = useRef(null)
    const slide2 = useRef(null)
    const slide3 = useRef(null)
    const prevBtnSlider = useRef(null)

    const slides = [slide1, slide2, slide3]

    function changeSlide(e) {
        const prevIndex = index
        setIndex(e.target.name)
        prevBtnSlider?.current?.classList?.remove('selected')
        e.target.classList.add('selected')
        if (!(e.target.name === prevIndex)) {
            slides[prevIndex].current.classList.remove('shown')
            slides[e.target.name].current.classList.add('shown')
            prevBtnSlider.current = e.target
        }
    }

    useEffect(() => {
        if (!slideSection.current &&
            !slide1.current &&
            !slide2.current &&
            !slide3.current) return // wait for the elementRef to be available
        const resizeObserver = new ResizeObserver((entries) => {
            let entry0H = entries[0]?.contentRect?.height
            let entry1H = entries[1]?.contentRect?.height
            let entry2H = entries[2]?.contentRect?.height
            let entry3H = entries[3]?.contentRect?.height
            function getTheHighest(elements) {
                return Math.max(...elements) + 'px'
            }
            if (slideSection.current) {
                slideSection.current.style.height = getTheHighest(
                    [entry1H, entry2H, entry3H]
                )
            }
        });
        resizeObserver.observe(slideSection.current)
        resizeObserver.observe(slide1.current)
        resizeObserver.observe(slide2.current)
        resizeObserver.observe(slide3.current)
        return () => resizeObserver.disconnect() // clean up 
    }, [slideSection.current, orderDetails, error])

    return (
        <>
            <Meta title='Mamma Mia | Checkout' />
            <main>
                <section className='cart-items'>
                    {cartData.items.map(item => {
                        return item.item ?
                            <CheckoutPizza
                                item={item}
                                key={item._id}
                            />
                            :
                            ''
                    })}
                </section>
                <div id='order'>
                    {!user?.email ?
                        <>
                            <div className='change-auth'>
                                <span
                                    onClick={() => setAuth(0)}
                                    className={`mode ${auth === 0 ? 'selected' : ''}`}
                                >
                                    Signup
                                </span>
                                <span>/</span>
                                <span
                                    onClick={() => setAuth(1)}
                                    className={`mode ${auth === 1 ? 'selected' : ''}`}
                                >
                                    Login
                                </span>
                            </div>
                            {
                                auth === 0
                                    ?
                                    <Signup
                                        setUser={setUser}
                                        setOrderDetails={setOrderDetails}
                                    />
                                    :
                                    <Login
                                        user={user}
                                        setUser={setUser}
                                        setCart={setCart}
                                    />
                            }
                        </>
                        :
                        <>
                            <div className='slides-container'>
                                <div className='change-slides-btns'>
                                    <button
                                        name='0'
                                        onClick={changeSlide}
                                        className='change-slide shipping-adress selected'
                                        ref={prevBtnSlider}
                                        type='button'
                                    >
                                        <span>1. Adress</span><HouseAdressSvg />
                                    </button>
                                    <div className='svg-con'>
                                        <ArrowRightSvg />
                                    </div>
                                    <button
                                        name='1'
                                        onClick={changeSlide}
                                        className='change-slide shipping-select'
                                        type='button'
                                    >
                                        <span>2. Shipping</span><ShippingSvg />
                                    </button>
                                    <div className='svg-con'>
                                        <ArrowRightSvg />
                                    </div>
                                    <button
                                        name='2'
                                        onClick={changeSlide}
                                        className='change-slide payment-select'
                                        type='button'
                                    >
                                        <span>3. Payment</span><DollarSvg />
                                    </button>
                                </div>

                                <section className='slide-section' ref={slideSection}>
                                    <div className='slide-item shown' ref={slide1} >
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
                                    <div className='slide-item' ref={slide2}>
                                        <Shipping
                                            handleShipping={handleShipping}
                                            shipping={shipping}
                                        />
                                    </div>
                                    <div className='slide-item' ref={slide3}>
                                        <PaymentMethods
                                            handlePaymentMethod={handlePaymentMethod}
                                            paymentMethod={paymentMethod}
                                            MasterCardLogo={MasterCardLogo}
                                            VisaCardLogo={VisaCardLogo}
                                        />
                                        <div className='order-overview'>
                                            <div className='details'>
                                                <h2>Order overview</h2>
                                                <div className='adress'>
                                                    <h3>Shipping Address</h3>
                                                    <p> {orderDetails?.firstname?.replace(/[^a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06\u00bf\u00a1]/gi, '') + ' ' + orderDetails?.lastname?.replace(/[^a-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06\u00bf\u00a1]/gi, '')}</p>
                                                    <p> {(orderDetails.adress).replace(/[^\sa-zA-Z0-9\+\_\-\@\&\=\.\,\(\)\:\ \/\?\|\<\>\"\'\!\%\*\\\#\$\^\;\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06]/gi, '')}</p>
                                                    <p> {(orderDetails.city).replace(/[^\sa-zA-Z0-9\+\_\-\@\&\=\.\,\(\)\:\ \/\?\|\<\>\"\'\!\%\*\\\#\$\^\;\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06]/gi, '')}</p>
                                                    <p> {(orderDetails.zip).replace(/[^\sa-zA-Z0-9\+\_\-\@\&\=\.\,\(\)\:\ \/\?\|\<\>\"\'\!\%\*\\\#\$\^\;\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06]/gi, '')}</p>
                                                </div>
                                                <div className='items'>
                                                    <h3>Prices</h3>
                                                    <p><span className='fw-600'>Products:</span> {cartData.totalCartPrice} CZK</p>
                                                    <p><span className='fw-600'>Shipping:</span> {shipping.price} CZK</p>
                                                    <p><span className='fw-600'>Payment method:</span> {paymentMethod.price} CZK</p>
                                                </div>
                                                <div>
                                                    <h3 className='total-price'>Total price: <span>{totalPrice} CZK</span></h3>
                                                </div>
                                            </div>
                                        </div>
                                        {error ? <div className='error-checkout'>
                                            Some values are invalid.
                                            Try to check every field in previous steps.
                                        </div> : ''}
                                        <button
                                            type='submit'
                                            onClick={handleSubmit}
                                            className='submit-order'
                                        >
                                            Submit Order
                                        </button>
                                    </div>
                                </section>

                            </div>
                        </>
                    }
                </div>
            </main>
        </>
    )
}

export const getServerSideProps = async (ctx) => {
    let error = false

    let cartData = { items: [] }
    let userData = {}

    await axios({
        method: 'get',
        url: `${server}/cart/getCartCheckout`,
        // url: `/api/cart/getCartCheckout`,
        withCredentials: true,
        params: {
            cart: ctx.query.cart
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin': `${server}`,
            Cookie: ctx.req.headers.cookie
        }
    })
        .then(res => cartData = res.data)
        .catch(e => {
            error = true
        })

    if (!cartData?.items?.length) {
        return {
            redirect: {
                permanent: false,
                destination: "/cart?empty=true"
            }
        }
    }

    await axios({
        method: 'get',
        url: `${server}/user/getUser`,
        // url: `api/cart/getCartAndUser`,
        withCredentials: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin': `${server}`,
            Cookie: ctx.req.headers.cookie
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