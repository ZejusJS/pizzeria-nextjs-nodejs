import React from 'react'

const OrderItemLoading = ({ PizzaSvg }) => {
    return (
        <div role="status" className="item loading">
            <div className="info-con">
                <PizzaSvg />
                <div className="info">
                    <div className="header"></div>
                    <div className="price"></div>
                    <div className="price second"></div>
                </div>
            </div>
        </div>
    )
}

export default OrderItemLoading