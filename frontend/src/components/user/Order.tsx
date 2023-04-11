import axios from "axios";
import { useEffect, useRef, useState } from "react"
import OrderItem from "./OrderItem";
import LoadingItem from '../../components/user/OrderItemLoading'

import RefreshSvg from '../../images/Refresh'
import Link from "next/link";

interface order {
    createdAt?: string;
    orderNo?: string | number;
    payId?: string | number;
    items?: [];
    totalPrice?: string | number;
    shippingPrice?: string | number;
}

const Order = ({ orderId, orderLoaded, viewItem, DocumentAddSvg, BackTurnSvg, PizzaSvg, setOrdersId, setOrdersLoaded }) => {
    const [status, setStatus] = useState(null)
    const [order, setOrder] = useState<order>(orderLoaded)
    const [paymentUrl, setPaymentUrl] = useState('')
    const [error, setError] = useState(null)
    // const [items, setItems] = useState(order?.items)

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const offset = 200
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
    }, [order])

    // useEffect(() => {
    //     const checkIsInViewPort = e => {
    //         const element = orderRef?.current
    //         if (element && !element.isLoaded && isInViewport(element)) {
    //             element.isLoaded = true

    //             // console.log('asd')

    //             // setTimeout(() => {
    //             //     element.isLoaded = false
    //             // }, 30000);

    //             axios({
    //                 method: 'get',
    //                 url: `/api2/payment/check-status/${order.payId}`
    //             })
    //                 .then(res => {
    //                     // console.log(res.data?.paymentStatus)
    //                     // console.log(res.data)
    //                     setStatus(res.data?.paymentStatus)
    //                     setPaymentUrl(order?.url)
    //                 })
    //                 .catch(e => {
    //                     console.error(e)
    //                     setError(e?.response?.status)
    //                 })
    //             if (!element.isItemsLoaded) {
    //                 element.isItemsLoaded = true
    //                 // console.log(items)
    //                 axios({
    //                     method: 'get',
    //                     url: `/api2/pizza/get-many`,
    //                     headers: {
    //                         "Content-Type": "application/json"
    //                     },
    //                     data: {
    //                         ids: items.map(it => it.item)
    //                     },
    //                     withCredentials: false
    //                 })
    //                     .then(res => {
    //                         // console.log(res.data)
    //                         setItems(prevItems => {
    //                             return prevItems.map(prevItem => {
    //                                 try {
    //                                     // let item = res?.data?.map(it => {
    //                                     //     console.log(prevItem.item, it._id)
    //                                     //     if (prevItem.item === it._id) {
    //                                     //         return it
    //                                     //     }
    //                                     // })
    //                                     let item
    //                                     for (let i = 0; i< res?.data?.length; i++) {
    //                                         if (res?.data[i]?._id === prevItem.item) {
    //                                             item = res?.data[i]
    //                                         }
    //                                     }
    //                                     return { ...prevItem, item: item }
    //                                 } catch {
    //                                     return prevItem
    //                                 }
    //                                 return prevItem
    //                             })
    //                         })
    //                     })
    //                     .catch(e => {
    //                         console.error(e)
    //                     })
    //             }
    //         }
    //     }

    //     checkIsInViewPort(null)

    //     document.addEventListener('scroll', checkIsInViewPort)

    //     return () => {
    //         document.removeEventListener('scroll', checkIsInViewPort);
    //     };
    // }, [])

    const refreshRef = useRef(null)

    async function getOrderDetails() {
        if (refreshRef?.current) refreshRef.current.disabled = true

        await axios({
            method: 'get',
            url: `/api2/payment/order/${orderId}`
        })
            .then(res => {
                // console.log(res)
                setOrder(res.data?.order)
                setStatus(res.data?.paymentStatus)
                setPaymentUrl(res.data.order?.url)
            })
            .catch(e => {
                console.error(e)
                setError(e?.response?.status)
            })
        setTimeout(() => {
            if (refreshRef?.current) refreshRef.current.disabled = false
        }, 1500);
        return
    }

    async function getStatus() {
        if (refreshRef?.current) refreshRef.current.disabled = true

        await axios({
            method: 'get',
            url: `/api2/payment/check-status/${orderId}/${orderLoaded?.payId}`
        })
            .then(res => {
                // console.log(res)
                setStatus(res.data?.paymentStatus)
                setPaymentUrl(orderLoaded?.paymentUrl)
            })
            .catch(e => {
                console.error(e)
                setError(e?.response?.status)
            })
        setTimeout(() => {
            if (refreshRef?.current) refreshRef.current.disabled = false
        }, 1500);
        return
    }

    useEffect(() => {
        if (orderLoaded?.url) setPaymentUrl(orderLoaded.url)

        const checkIsInViewPort = async e => {
            let element
            // if (e) element = e.currentTarget
            element = orderRef?.current

            if (element && order?.orderNo && order?.totalPrice) element.isLoaded = true
            if (element && !element.isLoaded && isInViewport(element)) {
                element.isLoaded = true
                console.log('loading')

                await getOrderDetails()
            }

            if (element?.isLoaded && !element?.isStatusLoaded && isInViewport(element)) {
                element.isStatusLoaded = true

                await getStatus()
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
                                                    <a target='_blank' href={`${paymentUrl || orderLoaded?.url}`}>Go to payment</a>
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
                    {
                        orderRef?.current?.isStatusLoaded ?
                            <button
                                onClick={getStatus}
                                ref={refreshRef}
                                className="refresh"
                                type="button">
                                <RefreshSvg />
                            </button> : ''
                    }
                </div>
                <div className="order-details">
                    {order?.orderNo ?
                        <h3>{order?.orderNo}</h3>
                        :
                        <div role="status" className="header-loading"></div>
                    }

                    <div className="items-order">
                        {order?.orderNo ?
                            <>{order?.items?.map((item: any) => (
                                <OrderItem
                                    key={item.title + item._id}
                                    item={item}
                                    viewItem={viewItem}
                                    PizzaSvg={PizzaSvg}
                                    LoadingItem={LoadingItem}
                                />
                            ))
                            }
                            </>
                            :
                            <>
                                <LoadingItem PizzaSvg={PizzaSvg} />
                                <LoadingItem PizzaSvg={PizzaSvg} />
                            </>
                        }
                        <Link href={`/user/profile/orders?payId=${order?.payId}`}>
                            More
                        </Link>
                    </div>
                </div>
                {order?.totalPrice || order?.shippingPrice ?
                    <div className="prices">
                        <p><span>Total</span>: {order?.totalPrice} CZK</p>
                        <p><span>Shipping</span>: {order?.shippingPrice} CZK</p>
                        <p><span>Created</span>: {date}</p>
                    </div>
                    :
                    <div role='status' className="prices loading">
                        <div className="loading-div"></div>
                    </div>
                }
            </div>
        </>
    )
}

export default Order