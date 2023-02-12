import React from 'react'

const Order = ({
    orderDetails,
    adressError,
    cityError,
    zipError,
    firstnameError,
    lastnameError,
    handleChange
}) => {
    return (
        <>
            <form className='order-details--form'>
                <h3>Order Details</h3>
                <div className='input-container'>
                    <label htmlFor="firstname">First name:</label>
                    <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        placeholder='First name *'
                        value={orderDetails.firstname}
                        onChange={handleChange}
                    />
                    <div
                        ref={firstnameError}
                        className='error'>
                        <p>This field is required. First name cannot contain more than 30 characters.</p>
                    </div>
                </div>
                <div className='input-container'>
                    <label htmlFor="lastname">Last name:</label>
                    <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        placeholder='Last name *'
                        value={orderDetails.lastname}
                        onChange={handleChange}
                    />
                    <div
                        ref={lastnameError}
                        className='error'>
                        <p>This field is required. Last name cannot contain more than 30 characters.</p>
                    </div>
                </div>
                <div className='input-container'>
                    <label htmlFor="adress">Adress:</label>
                    <input
                        type="text"
                        name="adress"
                        id="adress"
                        placeholder='Adress *'
                        value={orderDetails.adress}
                        onChange={handleChange}
                    />
                    <div
                        ref={adressError}
                        className='error'>
                        <p>This field is required. Adress cannot contain more than 50 characters.</p>
                    </div>
                </div>
                <div className='input-container'>
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        name="city"
                        id="city"
                        placeholder='City *'
                        value={orderDetails.city}
                        onChange={handleChange}
                    />
                    <div
                        ref={cityError}
                        className='error'>
                        <p>This field is required. City cannot contain more than 50 characters.</p>
                    </div>
                </div>
                <div className='input-container'>
                    <label htmlFor="zip">Zip code:</label>
                    <input
                        type="text"
                        name="zip"
                        id="zip"
                        placeholder='Zip *'
                        value={orderDetails.zip}
                        onChange={handleChange}
                    />
                    <div
                        ref={zipError}
                        className='error'>
                        <p>This field is required. Zip code cannot contain more than 16 characters.</p>
                    </div>
                </div>
                <div className='input-container'>
                    <label htmlFor="country">Country:</label>
                    <input
                        type="text"
                        name="country"
                        id="country"
                        placeholder='Country *'
                        value='Czech Rupublic'
                        disabled
                    />
                </div>
            </form>
        </>
    )
}

export default Order