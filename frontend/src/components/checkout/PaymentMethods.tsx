import React from 'react'

const PaymentMethods = ({ handlePaymentMethod, paymentMethod, MasterCardLogo, VisaCardLogo }) => {
    return (
        <form>
            <div className='payment'>
                <div className='payment-method'>
                    <div className='radio-container'>
                        <input
                            type="radio"
                            name='card'
                            value='card'
                            id='card'
                            className="radio-green"
                            onChange={handlePaymentMethod}
                            checked={paymentMethod.name === 'card' ? true : false}
                        />
                        <label
                            htmlFor="card"
                            className='radio-label-green'></label>
                    </div>
                    <div>
                        <h3>Pay with card</h3>
                        <div className='cards'>
                            <MasterCardLogo />
                            <VisaCardLogo />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PaymentMethods