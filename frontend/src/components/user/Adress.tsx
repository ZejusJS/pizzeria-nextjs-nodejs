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
    const btnSubmit = useRef(null)

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

            if (value.match(/[^\sa-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06\u00bf\u00a1]/gi)) {
                firstnameError?.current?.classList.add('second-shown')
            } else {
                firstnameError?.current?.classList.remove('second-shown')
            }
        }
        if (name === 'lastname') {
            if (value.length > 30) {
                lastnameError?.current?.classList.add('shown')
            } else {
                lastnameError?.current?.classList.remove('shown')
            }

            if (value.match(/[^\sa-zA-Z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06\u00bf\u00a1]/gi)) {
                lastnameError?.current?.classList.add('second-shown')
            } else {
                lastnameError?.current?.classList.remove('second-shown')
            }
        }
        if (name === 'adress') {
            if (value.length > 50) {
                adressError?.current?.classList.add('shown')
            } else {
                adressError?.current?.classList.remove('shown')
            }

            if (value.match(/[^\sa-zA-Z0-9\+\_\-\@\&\=\.\,\(\)\:\ \/\?\|\<\>\"\'\!\%\*\\\#\$\^\;\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06]/gi)) {
                adressError?.current?.classList.add('second-shown')
            } else {
                adressError?.current?.classList.remove('second-shown')
            }
        }
        if (name === 'city') {
            if (value.length > 50) {
                cityError?.current?.classList.add('shown')
            } else {
                cityError?.current?.classList.remove('shown')
            }

            if (value.match(/[^\sa-zA-Z0-9\+\_\-\@\&\=\.\,\(\)\:\ \/\?\|\<\>\"\'\!\%\*\\\#\$\^\;\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06]/gi)) {
                cityError?.current?.classList.add('second-shown')
            } else {
                cityError?.current?.classList.remove('second-shown')
            }
        }
        if (name === 'zip') {
            if (value.length > 16) {
                zipError?.current?.classList.add('shown')
            } else {
                zipError?.current?.classList.remove('shown')
            }

            if (value.match(/[^\sa-zA-Z0-9\+\_\-\@\&\=\.\,\(\)\:\ \/\?\|\<\>\"\'\!\%\*\\\#\$\^\;\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02af\u1d00-\u1d25\u1d62-\u1d65\u1d6b-\u1d77\u1d79-\u1d9a\u1e00-\u1eff\u2090-\u2094\u2184-\u2184\u2488-\u2490\u271d-\u271d\u2c60-\u2c7c\u2c7e-\u2c7f\ua722-\ua76f\ua771-\ua787\ua78b-\ua78c\ua7fb-\ua7ff\ufb00-\ufb06]/gi)) {
                zipError?.current?.classList.add('second-shown')
            } else {
                zipError?.current?.classList.remove('second-shown')
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        btnSubmit.current.disabled = true

        await axios({
            method: 'post',
            url: '/api/user/adress',
            headers: {
                "Content-Type": "application/json",
            },
            onUploadProgress: function (progressEvent) {
                NProgress.start()
            },
            onDownloadProgress: function (progressEvent) {
                NProgress.done(false)
            },
            data: adressData
        })
            .then(res => {
                router.push('/user/profile')
            })
            .catch(e => {
                console.error(e)
                btnSubmit.current.disabled = false
            })
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
                    <p className='general'>First name cannot contain more than 30 characters.</p>
                    <p className='second'>Cannot contain non-Latin or special characters.</p>
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
                    <p className='general'>Last name cannot contain more than 30 characters.</p>
                    <p className='second'>Cannot contain non-Latin or special characters.</p>
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
                    <p className='general'>Adress cannot contain more than 50 characters.</p>
                    <p className='second'>Cannot contain non-Latin characters.</p>
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
                    <p className='general'>City cannot contain more than 50 characters.</p>
                    <p className='second'>Cannot contain non-Latin characters.</p>
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
                    <p className='general'>Zip code cannot contain more than 16 characters.</p>
                    <p className='second'>Cannot contain non-Latin characters.</p>
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
            <button className='submit-btn' type='submit' ref={btnSubmit}>
                Save Shipping Adress
            </button>
        </form>
    )
}

export default Adress