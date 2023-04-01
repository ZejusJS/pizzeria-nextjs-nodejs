const OrderItem = ({ item, viewItem, PizzaSvg }) => {
    // console.log(item.item)
    return (
        <>
            <section className="items">
                {item?.title ?
                    <div className="item admin-pizza"
                        onClick={(e) => viewItem(e, { ...item, orderItem: true })}
                    >
                        <div className="info-con">
                            <img src={item?.images?.length ? item?.images[0]?.url : ''} alt="" loading="lazy" />
                            <div>
                                <h3>{item?.title}</h3>
                                <p className="description">{item?.description}</p>
                                <p className="price"><span>{item?.price} {item?.currency}</span></p>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="item loading">
                        <div className="info-con">
                            <PizzaSvg />
                            <div className="info">
                                <div className="header"></div>
                                <div className="price"></div>
                                <div className="price second"></div>
                            </div>
                        </div>
                    </div>
                }
            </section>
        </>
    )
}

export default OrderItem