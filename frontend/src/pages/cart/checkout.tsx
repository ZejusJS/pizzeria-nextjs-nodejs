import { server } from '../../config/config'
import CheckoutPizza from '../../components/cart/CheckoutPizza'
import axios from 'axios'
import NProgress from 'nprogress'
import { useRef, useState, useEffect, useCallback } from 'react'
import Signup from '../../components/auth/Signup'
import Order from '../../components/checkout/Order'
import Shipping from '../../components/checkout/Shipping'
import PaymentMethods from '../../components/checkout/PaymentMethods'

import MasterCardLogo from '../../images/MasterCardLogo'
import VisaCardLogo from '../../images/VisaCardLogo'
import HouseAdressSvg from '../../images/Houseadress'
import DollarSvg from '../../images/Dollar'
import ShippingSvg from '../../images/Box'

const checkout = ({ cartData, setUser, user, userData }) => {
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

    useEffect(() => {
        setTotalPrice(paymentMethod.price + shipping.price + cartData.totalCartPrice)
    }, [shipping, paymentMethod, orderDetails, cartData])

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
            .catch(e => console.error(e))
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
                    [entry1H, entry2H, entry3H])
            }
        });
        resizeObserver.observe(slideSection.current)
        resizeObserver.observe(slide1.current)
        resizeObserver.observe(slide2.current)
        resizeObserver.observe(slide3.current)
        return () => resizeObserver.disconnect() // clean up 
    }, [slideSection.current, orderDetails])

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
                <div id='order'>
                    {!user?.email ?
                        <Signup
                            setUser={setUser}
                            setOrderDetails={setOrderDetails}
                        />
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
                                        <span>1. Order Details</span><HouseAdressSvg />
                                    </button>
                                    <button
                                        name='1'
                                        onClick={changeSlide}
                                        className='change-slide shipping-select'
                                        type='button'
                                    >
                                        <span>2. Shipping</span><ShippingSvg />
                                    </button>
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
                                                    <p><span className='fw-600'>Name</span>: {orderDetails.firstname + ' ' + orderDetails.lastname}</p>
                                                    <p><span className='fw-600'>Adress</span>: {orderDetails.adress}</p>
                                                    <p><span className='fw-600'>City</span>: {orderDetails.city}</p>
                                                    <p><span className='fw-600'>Zip code</span>: {orderDetails.zip}</p>
                                                </div>
                                                <div className='items'>
                                                    <h3>Prices</h3>
                                                    <p><span className='fw-600'>Price for products:</span> {cartData.totalCartPrice} CZK</p>
                                                    <p><span className='fw-600'>Price for shipping:</span> {shipping.price} CZK</p>
                                                    <p><span className='fw-600'>Price for payment method:</span> {paymentMethod.price} CZK</p>
                                                </div>
                                                <div>
                                                    <h3 className='total-price'>Total price: <span>{totalPrice} CZK</span></h3>
                                                </div>
                                            </div>
                                        </div>
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