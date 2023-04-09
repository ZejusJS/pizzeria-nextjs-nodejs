import { useState } from "react"
import Order from "./Order"

import PizzaSvg from "../../images/Pizza"

const Orders = ({ userData, viewItem, DocumentAddSvg, BackTurnSvg }) => {
    const [pageNumber, setPageNumber] = useState(0)
    const [ordersId, setOrdersId] = useState(userData?.orders)
    let ordersPerPage = 9

    function anotherOrders() {
        setPageNumber(prev => ++prev)
    }

    return (
        <section className="orders">
            <h2>Orders</h2>
            {
                ordersId?.slice(0, pageNumber * ordersPerPage + ordersPerPage)
                    .map(order => (
                        <Order
                            orderId={order}
                            key={order?.orderNo}
                            viewItem={viewItem}
                            DocumentAddSvg={DocumentAddSvg}
                            BackTurnSvg={BackTurnSvg}
                            PizzaSvg={PizzaSvg}
                            setOrdersId={setOrdersId}
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