import axios from "axios";
import { useEffect, useRef, useState } from "react"
import OrderItem from "./OrderItem";

const Order = ({ order, viewItem, DocumentAddSvg, BackTurnSvg, PizzaSvg }) => {
    const [status, setStatus] = useState(null)
    const [paymentUrl, setPaymentUrl] = useState(null)
    const [error, setError] = useState(null)
    const [items, setItems] = useState(order.items)

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const offset = 250
        return (
            rect.right >= -offset &&
            rect.bottom >= -offset &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) + offset &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) + offset
        );
    }

    const orderRef = useRef(null)

    const [date, setDate] = useState(null)

    useEffect(() => {
        setDate(new Date(order?.createdAt).toLocaleString())
    }, [])

    useEffect(() => {
        const checkIsInViewPort = e => {
            const element = orderRef?.current
            if (element && !element.isLoaded && isInViewport(element)) {
                element.isLoaded = true

                // console.log('asd')

                setTimeout(() => {
                    element.isLoaded = false
                }, 30000);

                axios({
                    method: 'get',
                    url: `/api/payment/check-status/${order.payId}`
                })
                    .then(res => {
                        // console.log(res.data?.paymentStatus)
                        // console.log(res.data)
                        setStatus(res.data?.paymentStatus)
                        setPaymentUrl(order?.url)
                    })
                    .catch(e => {
                        console.error(e)
                        setError(e?.response?.status)
                    })
                if (!element.isItemsLoaded) {
                    element.isItemsLoaded = true
                    // console.log(items)
                    axios({
                        method: 'post',
                        url: `/api/pizza/get-many`,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: {
                            ids: items.map(it => it.item)
                        },
                        withCredentials: false
                    })
                        .then(res => {
                            // console.log(res.data)
                            setItems(prevItems => {
                                return prevItems.map(prevItem => {
                                    try {
                                        // let item = res?.data?.map(it => {
                                        //     console.log(prevItem.item, it._id)
                                        //     if (prevItem.item === it._id) {
                                        //         return it
                                        //     }
                                        // })
                                        let item
                                        for (let i = 0; i< res?.data?.length; i++) {
                                            if (res?.data[i]?._id === prevItem.item) {
                                                item = res?.data[i]
                                            }
                                        }
                                        return { ...prevItem, item: item }
                                    } catch {
                                        return prevItem
                                    }
                                    return prevItem
                                })
                            })
                        })
                        .catch(e => {
                            console.error(e)
                        })
                }
            }
        }

        checkIsInViewPort(null)

        document.addEventListener('scroll', checkIsInViewPort)

        return () => {
            document.removeEventListener('scroll', checkIsInViewPort);
        };
    }, [])

    return (
        <>
            <div className="order" ref={orderRef}>
                <div>
                    {
                        error === 401 || error === 403 || error === 400 || error === 500 ?
                            <div className="payment-error">
                                ERROR with providing status ({error})
                            </div>
                            : status === null ?
                                <div className="payment-loading">
                                    <span>
                                        <div className="spinner-border" role="status"></div>
                                    </span>
                                    Loading...
                                </div>
                                : status === 0 ?
                                    <div className="payment-issue">
                                        <span>&#x203C;</span>
                                        Issue with payment
                                    </div>
                                    : status === 1 ?
                                        <div className="payment-created">
                                            <span>
                                                <DocumentAddSvg />
                                            </span>
                                            <div>
                                                Payment created
                                                <div>
                                                    <a target='_blank' href={`${paymentUrl}`}>Go to payment</a>
                                                </div>
                                            </div>
                                        </div>
                                        : status === 2 ?
                                            <div className="payment-progress">
                                                <span>
                                                    <div className="spinner-grow" role="status"></div>
                                                </span>
                                                Payment in progress
                                            </div>
                                            : status === 3 ?
                                                <div className="payment-cancelled">
                                                    <span>&#x274C;</span>
                                                    Payment cancelled
                                                </div>
                                                : status === 4 ?
                                                    <div className="payment-confirmed">
                                                        <span>
                                                            <DocumentAddSvg />
                                                        </span>
                                                        Payment confirmed
                                                    </div>
                                                    : status === 5 ?
                                                        <div className="payment-revoked">
                                                            <span>&#x274C;</span>
                                                            Payment revoked
                                                        </div>
                                                        : status === 6 ?
                                                            <div className="payment-rejected">
                                                                <span>&#x274C;</span>
                                                                Payment rejected
                                                            </div>
                                                            : status === 7 || status === 8 ?
                                                                <div className="payment-successful">
                                                                    <span>&#x2714;</span>
                                                                    Payment successful
                                                                </div>
                                                                : status === 9 ?
                                                                    <div className="payment-progress-refund">
                                                                        <span>
                                                                            <div className="spinner-grow" role="status"></div>
                                                                        </span>
                                                                        Refund in progress
                                                                    </div>
                                                                    : status === 10 ?
                                                                        <div className="payment-refund">
                                                                            <span>
                                                                                <BackTurnSvg />
                                                                            </span>
                                                                            Refunded
                                                                        </div>
                                                                        : ''
                    }
                </div>
                <div className="order-details">
                    <h3>{order.orderNo}</h3>
                    <div className="items">
                        {items?.map(item => (
                            <OrderItem
                                key={Math.random()}
                                item={item}
                                viewItem={viewItem}
                                PizzaSvg={PizzaSvg}
                            />
                        ))
                        }
                    </div>
                </div>
                <div className="prices">
                    <p><span>Total</span>: {order.totalPrice} CZK</p>
                    <p><span>Shipping</span>: {order.shippingPrice} CZK</p>
                    <p><span>Created</span>: {date}</p>
                </div>
            </div>
        </>
    )
}

export default Order