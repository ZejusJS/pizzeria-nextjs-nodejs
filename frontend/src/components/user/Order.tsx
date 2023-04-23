import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react"
import Link from "next/link";
import { useQuery, UseQueryResult } from "@tanstack/react-query"

import OrderItem from "./OrderItem";
import LoadingItem from '../../components/user/OrderItemLoading'
import PaymentStatus from './PaymentStatus'
import { fetchPaymentStatus } from "../../utils/fetch";

import { IOrder } from '../../utils/types/orders'

import RefreshSvg from '../../images/Refresh'

const Order = ({ orderId, orderLoaded, viewItem, PizzaSvg, setOrdersId }) => {
    const [paymentUrl, setPaymentUrl] = useState('')
    const [date, setDate] = useState(null)
    const [enabledQuery, setEnabledQuery] = useState(false)

    const { status: queryStatus, data: status, error: queryError, isFetching, refetch, isStale, isFetched }: UseQueryResult<IOrder, AxiosError> = useQuery({
        queryKey: ['paymentStatus', orderLoaded?._id],
        queryFn: async (obj) => {
            return await fetchPaymentStatus(orderLoaded?._id, orderLoaded?.payId)
        },
        staleTime: 1000 * 60 * 5,
        retry: 2,
        enabled: enabledQuery
    })

    const orderRef = useRef(null)
    const refreshRef = useRef(null)

    useEffect(() => {
        setDate(new Date(orderLoaded?.createdAt).toLocaleString())
    }, [orderLoaded])

    async function getStatus() {
        if (refreshRef?.current) refreshRef.current.disabled = true

        await refetch()

        setTimeout(() => {
            if (refreshRef?.current) refreshRef.current.disabled = false
        }, 1500);
        return
    }

    useEffect(() => {
        if (orderLoaded?.url) setPaymentUrl(orderLoaded.url)

        let element
        element = orderRef?.current

        var observer = new IntersectionObserver(onIntersection, {
            root: null,
            threshold: 0.01,
            rootMargin: "200px",
        })

        function onIntersection(entries, opts) {
            entries.forEach(async entry => {
                if (element && orderLoaded?.orderNo && orderLoaded?.totalPrice) element.isLoaded = true
                if (element && !element.isLoaded && entry.isIntersecting) {
                    element.isLoaded = true
                }

                if (element?.isLoaded && entry.isIntersecting) {
                    // await refetch()
                    setEnabledQuery(true)
                } else {
                    setEnabledQuery(false)
                }
            }
            )
        }

        observer.observe(orderRef?.current)

        return () => {
            observer.disconnect()
        };
    }, [])

    return (
        <>
            <div className="order" ref={orderRef}>
                <div>
                    <PaymentStatus
                        status={status?.paymentStatus}
                        error={queryError?.response?.status || 0}
                        paymentUrl={paymentUrl}
                        order={orderLoaded}
                    />
                    {
                        orderRef?.current?.isStatusLoaded ?
                            <button
                                onClick={getStatus}
                                ref={refreshRef}
                                className="btn-refresh-status"
                                type="button"
                            >
                                <RefreshSvg />
                            </button> : ''
                    }
                </div>
                <div className="order-details">
                    {orderLoaded?.orderNo ?
                        <h3>
                            <Link href={`/user/profile/orders?payId=${orderLoaded?.payId}`}
                                shallow={true}
                                scroll={true}
                            >
                                {orderLoaded?.orderNo}
                            </Link>
                        </h3>
                        :
                        <div role="status" className="header-loading"></div>
                    }

                    <div className="items-order">
                        {orderLoaded?.orderNo ?
                            <>{orderLoaded?.items?.map((item: any) => (
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
                        <div className="view-more">
                            <Link href={`/user/profile/orders?payId=${orderLoaded?.payId}`}
                                shallow={true}
                                scroll={true}
                            >
                                &#43; View More Information
                            </Link>
                        </div>
                    </div>
                </div>
                {orderLoaded?.totalPrice || orderLoaded?.shippingPrice ?
                    <div className="prices">
                        <p><span>Total</span>: {orderLoaded?.totalPrice} CZK</p>
                        <p><span>Shipping</span>: {orderLoaded?.shippingPrice} CZK</p>
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