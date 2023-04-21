import { useEffect, useRef, useState } from "react"
import axios from "axios"

import Order from "./Order"
import Spinner from "../Spinner"
import OrderView from "./OrderView"

import PizzaSvg from "../../images/Pizza"

import { fetchUserOrders } from "../../utils/fetch"
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"

const Orders = ({ userData, viewItem, slug, setBackUrl, setBackText, payIdQuery }) => {
    // const [pageNumber, setPageNumber] = useState(0)
    // const [ordersLoaded, setOrdersLoaded] = useState([])
    const [ordersId, setOrdersId] = useState(userData?.orders)
    // const [isLoading, setIsLoading] = useState(false)

    let ordersPerPage = 12

    const { status, error, data: ordersLoaded, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ['orders', 'infinite'],
        getNextPageParam: (prevData: any) => prevData.nextPage,
        keepPreviousData: true,
        queryFn: ({pageParam = 0}) => fetchUserOrders(ordersId, pageParam, ordersPerPage)
    })

    // console.log(ordersLoaded)

    function anotherOrders() {
        // setPageNumber(prev => ++prev)
        fetchNextPage()
    }

    // useEffect(() => {
    //     // setIsLoading(true)
    //     // console.log(ordersLoaded)
    // }, [pageNumber])

    return (
        <>
            <div className="order-sites-con">
                <section className={`orders ${payIdQuery ? 'hidden' : ''}`}>
                    <h2>Orders</h2>
                    {
                        ordersLoaded?.pages?.flatMap(data => data.orders)
                            .map(orderLoaded => (
                                <Order
                                    orderId={orderLoaded._id}
                                    orderLoaded={orderLoaded}
                                    key={orderLoaded._id}
                                    viewItem={viewItem}
                                    PizzaSvg={PizzaSvg}
                                    setOrdersId={setOrdersId}
                                />
                            ))
                    }
                    <div className="orders-footer-con">
                        {(ordersLoaded?.pages[ordersLoaded.pages.length - 1]?.page * ordersPerPage + ordersPerPage) < userData?.orders?.length && !isFetching ?
                            <button
                                onClick={() => anotherOrders()}
                                className={`btn-styled load-orders`}
                            >
                                Load Another Orders
                            </button> : ''}
                        {isFetching ?
                            <div className="loading-orders">
                                <Spinner />
                            </div>
                            : !userData?.orders?.length && !isFetching ?
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