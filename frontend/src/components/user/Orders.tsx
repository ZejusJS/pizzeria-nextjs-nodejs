import { useEffect, useState } from "react"
import Order from "./Order"

import Spinner from "../Spinner"
import FakeNProgress from 'nprogress'

import PizzaSvg from "../../images/Pizza"
import axios from "axios"

const Orders = ({ userData, viewItem, DocumentAddSvg, BackTurnSvg, slug }) => {
    const [pageNumber, setPageNumber] = useState(0)
    const [ordersLoaded, setOrdersLoaded] = useState([])
    const [ordersId, setOrdersId] = useState(userData?.orders)
    const [isLoading, setIsLoading] = useState(false)
    let ordersPerPage = 9

    console.log(ordersLoaded)

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
                <section className={`orders ${!slug[1] ? 'of-h' : ''}`}>
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
                                    DocumentAddSvg={DocumentAddSvg}
                                    BackTurnSvg={BackTurnSvg}
                                    PizzaSvg={PizzaSvg}
                                    setOrdersId={setOrdersId}
                                />
                            ))
                    }
                    <div className="orders-footer-con">
                        {(pageNumber * ordersPerPage + ordersPerPage) <= userData?.orders?.length && !isLoading ?
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
                            : ''
                        }
                    </div>
                </section>
            </div>
        </>
    )
}

export default Orders