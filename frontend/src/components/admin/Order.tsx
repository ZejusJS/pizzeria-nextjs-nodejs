const Order = ({order}) => {
    return (
        <>
            <div className="order">
                <div className="details">
                    <h3>{order.orderNo}</h3>
                    <p>Created: {new Date(order?.createdAt).toLocaleString()}</p>
                    <p>Total: {order.totalPrice} CZK</p>
                </div>
            </div>
        </>
    )
}

export default Order