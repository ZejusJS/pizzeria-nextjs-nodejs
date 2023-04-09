const OrderItem = ({ item, viewItem, PizzaSvg, LoadingItem }) => {
    // console.log(item.item)
    return (
        <>
            {item.item?.title ?
                <div className="item"
                    onClick={(e) => viewItem(e, { ...item?.item, orderItem: true })}
                >
                    <div className="info-con">
                        <img src={item?.item?.images?.length ? item?.item?.images[0]?.url : ''} alt="" loading="lazy" />
                        <div>
                            <h3>{item?.item?.title}</h3>
                            <p className="price"><span>{item?.price} CZK</span> x {item?.quantity} pcs</p>
                        </div>
                    </div>
                </div>
                :
                <LoadingItem PizzaSvg={PizzaSvg} />
            }
        </>
    )
}

export default OrderItem