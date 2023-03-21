import axios from "axios";
import { useEffect, useRef, useState } from "react"

const Order = ({ order, viewItem, DocumentAddSvg, BackTurnSvg }) => {
    const [status, setStatus] = useState(null)
    const [paymentUrl, setPaymentUrl] = useState(null)
    const [error, setError] = useState(null)

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const offset = 100
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
        const checkIsInViewPort = async e => {
            const element = orderRef?.current
            if (element && !element.isLoaded) {
                if (isInViewport(element)) {
                    element.isLoaded = true

                    // console.log('asd')

                    setTimeout(() => {
                        element.isLoaded = false
                    }, 30000);

                    await axios({
                        method: 'get',
                        url: `/api/payment/check-status/${order.payId}`
                    })
                        .then(res => {
                            console.log(res.data?.paymentStatus)
                            console.log(res.data)
                            setStatus(res.data?.paymentStatus)
                            setPaymentUrl(order?.url)
                        })
                        .catch(e => {
                            console.error(e)
                            setError(e?.response?.status)
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
                <div className="order-details">
                    <h3>{order.orderNo}</h3>
                    <div className="items">
                        {order?.items?.map(item => (
                            <div className="item"
                                onClick={(e) => viewItem(e, { ...item?.item, orderItem: true })}
                            >
                                <div className="info-con">
                                    <img src={item.item?.images[0]?.url} alt="" loading="lazy" />
                                    <div>
                                        <h3>{item?.item?.title}</h3>
                                        <p className="price"><span>{item?.item?.price} {item?.item?.currency}</span> x {item?.quantity} pcs</p>
                                    </div>
                                </div>
                            </div>
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