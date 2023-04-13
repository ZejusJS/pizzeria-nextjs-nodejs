import { useEffect, useRef, useState } from "react"
import axios from "axios"

import Order from "./Order"
import Spinner from "../Spinner"
import OrderView from "./OrderView"

import PizzaSvg from "../../images/Pizza"

const Orders = ({ userData, viewItem, slug, setBackUrl, setBackText, payIdQuery }) => {
    const [pageNumber, setPageNumber] = useState(0)
    const [ordersLoaded, setOrdersLoaded] = useState([])
    const [ordersId, setOrdersId] = useState(userData?.orders)
    const [isLoading, setIsLoading] = useState(false)

    let ordersPerPage = 9

    function anotherOrders() {
        setPageNumber(prev => ++prev)
    }

    useEffect(() => {
        setIsLoading(true)

        axios({
            method: 'get',
            url: `/api2/payment/orders/${ordersId.slice(pageNumber * ordersPerPage, pageNumber * ordersPerPage + ordersPerPage)}`
        })
            .then(res => {
                // console.log(res.data)
                setOrdersLoaded(prev => {
                    return [...prev, ...res.data.orders]
                })
                setIsLoading(false)
            })
            .catch(e => {
                setIsLoading(false)
                console.error(e)
            })
        // console.log(ordersLoaded)
    }, [pageNumber])

    return (
        <>
            <div className="order-sites-con">
                <section className={`orders ${payIdQuery ? 'hidden' : ''}`}>
                    <h2>Orders</h2>
                    {
                        ordersLoaded?.slice(0, pageNumber * ordersPerPage + ordersPerPage)
                            .map(orderLoaded => (
                                <Order
                                    orderId={orderLoaded._id}
                                    orderLoaded={orderLoaded}
                                    setOrdersLoaded={setOrdersLoaded}
                                    key={orderLoaded._id}
                                    viewItem={viewItem}
                                    PizzaSvg={PizzaSvg}
                                    setOrdersId={setOrdersId}
                                />
                            ))
                    }
                    <div className="orders-footer-con">
                        {(pageNumber * ordersPerPage + ordersPerPage) < userData?.orders?.length && !isLoading ?
                            <button
                                onClick={anotherOrders}
                                className={`btn-styled load-orders`}
                            >
                                Load Another Orders
                            </button> : ''}
                        {isLoading ?
                            <div className="loading-orders">
                                <Spinner />
                            </div>
                            : !userData?.orders?.length && !isLoading ?
                                <>
                                    <div className="no-orders">
                                        <p>You have no orders yet</p>
                                    </div>
                                </>
                                : ''
                        }
                    </div>
                </section>
                <OrderView
                    setBackUrl={setBackUrl}
                    setBackText={setBackText}
                    payIdQuery={payIdQuery}
                    viewItem={viewItem}
                />
            </div>
        </>
    )
}

export default Orders