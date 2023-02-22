import axios from 'axios'
import React, { useRef, useState } from 'react'
import NProgress from 'nprogress'

const Adress = ({
    shippingAdress,
    router
}) => {
    const [adressData, setAdressData] = useState({
        firstname: shippingAdress.firstname ? shippingAdress.firstname : '',
        lastname: shippingAdress.lastname ? shippingAdress.lastname : '',
        city: shippingAdress.city ? shippingAdress.city : '',
        zip: shippingAdress.zip ? shippingAdress.zip : '',
        adress: shippingAdress.adress ? shippingAdress.adress : '',
    })

    const firstnameError = useRef(null)
    const lastnameError = useRef(null)
    const adressError = useRef(null)
    const cityError = useRef(null)
    const zipError = useRef(null)

    function handleChange(e) {
        const { name, value } = e.target
        setAdressData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
        if (name === 'firstname') {
            if (value.length > 30) {
                firstnameError?.current?.classList.add('shown')
            } else {
                firstnameError?.current?.classList.remove('shown')
            }
        }
        if (name === 'lastname') {
            if (value.length > 30) {
                lastnameError?.current?.classList.add('shown')
            } else {
                lastnameError?.current?.classList.remove('shown')
            }
        }
        if (name === 'adress') {
            if (value.length > 50) {
                adressError?.current?.classList.add('shown')
            } else {
                adressError?.current?.classList.remove('shown')
            }
        }
        if (name === 'city') {
            if (value.length > 50) {
                cityError?.current?.classList.add('shown')
            } else {
                cityError?.current?.classList.remove('shown')
            }
        }
        if (name === 'zip') {
            if (value.length > 16) {
                zipError?.current?.classList.add('shown')
            } else {
                zipError?.current?.classList.remove('shown')
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        await axios({
            method: 'post',
            url: '/api/user/adress',
            headers: {
                "Content-Type": "application/json",
            },
            onUploadProgress: function (progressEvent) {
                e.target.classList.add('btn-cart-loading')
                NProgress.start()
            },
            onDownloadProgress: function (progressEvent) {
                e.target.classList.remove('btn-cart-loading')
                NProgress.done(false)
            },
            data: adressData
        })
        .then(res => {
            router.push('/user/profile')
        })
        .catch(e => console.error(e))
    }

    return (
        <form className='basic-form shipping-adress' onSubmit={handleSubmit}>
            <h3>Add Shipping Adress</h3>
            <div className='input-container'>
                <label htmlFor="firstname">First name:</label>
                <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder='First name *'
                    value={adressData.firstname}
                    onChange={handleChange}
                />
                <div
                    ref={firstnameError}
                    className='error'>
                    <p>First name cannot contain more than 30 characters.</p>
                </div>
            </div>
            <div className='input-container'>
                <label htmlFor="lastname">Last name:</label>
                <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder='Last name *'
                    value={adressData.lastname}
                    onChange={handleChange}
                />
                <div
                    ref={lastnameError}
                    className='error'>
                    <p>Last name cannot contain more than 30 characters.</p>
                </div>
            </div>
            <div className='input-container'>
                <label htmlFor="adress">Adress:</label>
                <input
                    type="text"
                    name="adress"
                    id="adress"
                    placeholder='Adress *'
                    value={adressData.adress}
                    onChange={handleChange}
                />
                <div
                    ref={adressError}
                    className='error'>
                    <p>Adress cannot contain more than 50 characters.</p>
                </div>
            </div>
            <div className='input-container'>
                <label htmlFor="city">City:</label>
                <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder='City *'
                    value={adressData.city}
                    onChange={handleChange}
                />
                <div
                    ref={cityError}
                    className='error'>
                    <p>City cannot contain more than 50 characters.</p>
                </div>
            </div>
            <div className='input-container'>
                <label htmlFor="zip">Zip code:</label>
                <input
                    type="text"
                    name="zip"
                    id="zip"
                    placeholder='Zip *'
                    value={adressData.zip}
                    onChange={handleChange}
                />
                <div
                    ref={zipError}
                    className='error'>
                    <p>Zip code cannot contain more than 16 characters.</p>
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
            <button className='submit-btn' type='submit'>
                Submit Shipping Adress
            </button>
        </form>
    )
}

export default Adress