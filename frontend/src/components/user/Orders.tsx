import { useState } from "react"
import Order from "./Order"

const Orders = ({ userData, viewItem, DocumentAddSvg, BackTurnSvg }) => {
    const [pageNumber, setPageNumber] = useState(0)
    let ordersPerPage = 8

    function anotherOrders() {
        setPageNumber(prev => ++prev)
    }

    return (
        <section className="orders">
            <h2>Orders</h2>
            {
                userData?.orders?.slice(0, pageNumber * ordersPerPage + ordersPerPage)
                    .map(order => (
                        <Order
                            order={order}
                            key={order?.orderNo}
                            viewItem={viewItem}
                            DocumentAddSvg={DocumentAddSvg}
                            BackTurnSvg={BackTurnSvg}
                        />
                    ))
            }
            { (pageNumber * ordersPerPage + ordersPerPage) <= userData?.orders?.length ?
                <button
                onClick={anotherOrders}
                className={`btn-styled load-orders`}
            >
                Load Another Orders
            </button> : ''}
        </section>
    )
}

export default Orders