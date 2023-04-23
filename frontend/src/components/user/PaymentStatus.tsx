import React from 'react'

import DocumentAddSvg from "../../images/DocumentAdd"
import BackTurnSvg from "../../images/BackTurn"

const PaymentStatus = ({ status, error, paymentUrl, order }) => {
    return (
        <>
            {
                error !== 0 ?
                    <div className="payment-status-error">
                        ERROR with providing status { error ? `(${error})` : ''}
                    </div>
                    : status === null || status === undefined ?
                        <div className="payment-status-loading">
                            <span className='svg-con'>
                                <div className="spinner-border" role="status"></div>
                            </span>
                            Loading...
                        </div>
                        : status === 0 ?
                            <div className="payment-status-issue">
                                <span className='svg-con'>&#x203C;</span>
                                Issue with payment
                            </div>
                            : status === 1 ?
                                <div className="payment-status-created">
                                    <span className='svg-con'>
                                        <DocumentAddSvg />
                                    </span>
                                    <div>
                                        Payment created
                                        <div>
                                            <a target='_blank' href={`${paymentUrl || order?.url}`}>Go to payment</a>
                                        </div>
                                    </div>
                                </div>
                                : status === 2 ?
                                    <div className="payment-status-progress">
                                        <span className='svg-con'>
                                            <div className="spinner-grow" role="status"></div>
                                        </span>
                                        Payment in progress
                                    </div>
                                    : status === 3 ?
                                        <div className="payment-status-cancelled">
                                            <span className='svg-con'>&#x274C;</span>
                                            Payment cancelled
                                        </div>
                                        : status === 4 ?
                                            <div className="payment-status-confirmed">
                                                <span className='svg-con'>
                                                    <DocumentAddSvg />
                                                </span>
                                                Payment confirmed
                                            </div>
                                            : status === 5 ?
                                                <div className="payment-status-revoked">
                                                    <span className='svg-con'>&#x274C;</span>
                                                    Payment revoked
                                                </div>
                                                : status === 6 ?
                                                    <div className="payment-status-rejected">
                                                        <span className='svg-con'>&#x274C;</span>
                                                        Payment rejected
                                                    </div>
                                                    : status === 7 || status === 8 ?
                                                        <div className="payment-status-successful">
                                                            <span className='svg-con'>&#x2714;</span>
                                                            Payment successful
                                                        </div>
                                                        : status === 9 ?
                                                            <div className="payment-status-progress-refund">
                                                                <span className='svg-con'>
                                                                    <div className="spinner-grow" role="status"></div>
                                                                </span>
                                                                Refund in progress
                                                            </div>
                                                            : status === 10 ?
                                                                <div className="payment-status-refund">
                                                                    <span className='svg-con'>
                                                                        <BackTurnSvg />
                                                                    </span>
                                                                    Refunded
                                                                </div>
                                                                : <div>lol</div>
            }
        </>
    )
}

export default PaymentStatus