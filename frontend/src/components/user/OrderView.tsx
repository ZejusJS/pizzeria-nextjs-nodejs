import React, { useEffect, useRef, useState } from 'react'
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { AxiosError } from 'axios'

import LoadingItem from '../../components/user/OrderItemLoading'
import OrderItem from "./OrderItem"
import PaymentStatus from './PaymentStatus'

import { fetchOrder } from '../../utils/fetch'

import { IOrder } from '../../utils/types/orders'

import PizzaSvg from "../../images/Pizza"
import RefreshSvg from '../../images/Refresh'

const OrderView = ({ setBackUrl, setBackText, payIdQuery, viewItem }) => {
    // const [viewOrder, setViewOrder] = useState<order>()
    const [date, setDate] = useState(null)
    const [enabledQuery, setEnabledQuery] = useState(false)

    const { status: queryStatus, data: viewOrder, error: queryError, isFetching, refetch, isStale, isFetched }: UseQueryResult<IOrder, AxiosError> = useQuery({
        queryKey: ['orderView', payIdQuery],
        queryFn: async (obj) => {
            return await fetchOrder(payIdQuery)
        },
        staleTime: 1000 * 60 * 10,
        retry: 3,
        enabled: payIdQuery?.length && enabledQuery ? true : false
    })

    const refreshRef = useRef(null)

    useEffect(() => {
        setDate(new Date(viewOrder?.createdAt).toLocaleString())
    }, [viewOrder])

    async function fetchOrderData() {
        if (refreshRef?.current) refreshRef.current.disabled = true

        refetch()

        setTimeout(() => {
            if (refreshRef?.current) refreshRef.current.disabled = false
        }, 1000);
    }

    useEffect(() => {
        if (payIdQuery) {
            setEnabledQuery(true)
        } else {
            setEnabledQuery(false)
        }
    }, [payIdQuery])

    return (
        <>
            <section className={`order-view-con ${!payIdQuery ? 'hidden' : ''}`}>
                <div className="order-status">
                    <div className="payment-status">
                        <PaymentStatus
                            status={viewOrder?.paymentStatus}
                            error={queryError || 0}
                            paymentUrl={undefined}
                            order={viewOrder}
                        />
                        <button
                            onClick={fetchOrderData}
                            ref={refreshRef}
                            className="btn-refresh-status"
                            type="button"
                        >
                            <RefreshSvg />
                        </button>
                    </div>
                </div>
                <div className={`order-view`}>
                    {isFetched && viewOrder?.orderNo ?
                        <>
                            <h2><span>Order:</span> {viewOrder?.orderNo}</h2>
                            <h4>ID: {viewOrder?.payId}</h4>
                            <p>Created: {date}</p>
                            <div className="prices">
                                <p>Total: <span className="total-price">{viewOrder?.totalPrice} CZK</span></p>
                                <p>Shipping: {viewOrder?.shippingPrice} CZK</p>
                            </div>
                            <div className="items-order items-order-view">
                                {viewOrder?.orderNo ?
                                    <>{viewOrder?.items?.map((item: any) => (
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
                            </div>
                            <div className="order-details">
                                <div className="details">
                                    <h3>Invoice details</h3>
                                    <p>{viewOrder?.invoiceInfo?.firstname} {viewOrder?.invoiceInfo?.lastname}</p>
                                    <p>{viewOrder?.invoiceInfo?.address1}</p>
                                    <p>{viewOrder?.invoiceInfo?.city}</p>
                                    <p>{viewOrder?.invoiceInfo?.zip}</p>
                                </div>
                                <div className="details">
                                    <h3>Shipping address</h3>
                                    <p>{viewOrder?.shippingAdress?.firstname} {viewOrder?.shippingAdress?.lastname}</p>
                                    <p>{viewOrder?.shippingAdress?.address1}</p>
                                    <p>{viewOrder?.shippingAdress?.city}</p>
                                    <p>{viewOrder?.shippingAdress?.zip}</p>
                                </div>
                            </div>
                        </>
                        :
                        <div className="order-loading" role="status">
                            <div className="header first"></div>
                            <div className="header second"></div>
                            <div className="paragraph first"></div>
                            <div className="items-order items-order-view">
                                <LoadingItem PizzaSvg={PizzaSvg} />
                                <LoadingItem PizzaSvg={PizzaSvg} />
                            </div>
                            <div className="header"></div>
                            <div className="paragraph second"></div>
                            <div className="paragraph first"></div>
                            <div className="paragraph third"></div>
                            <div className="paragraph fourth"></div>
                            <div className="header second"></div>
                            <div className="paragraph first"></div>
                            <div className="paragraph second"></div>
                            <div className="paragraph third"></div>
                            <div className="paragraph first"></div>
                        </div>
                    }
                </div>
            </section>
        </>
    )
}

export default OrderView