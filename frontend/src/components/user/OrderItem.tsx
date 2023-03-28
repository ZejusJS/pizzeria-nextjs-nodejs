const OrderItem = ({item, viewItem}) => {
    return (
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
    )
}

export default OrderItem