import { useEffect, useRef, useState } from "react"
import NProgress from 'nprogress'
import axios from "axios"

const Billing = ({
    userData,
    router,
    fetchFirstData,
    isLoadingFirstData
}) => {
    let initialData = {
        adress: userData?.invoiceInfo?.adress,
        zip: userData?.invoiceInfo?.zip,
        city: userData?.invoiceInfo?.city,
        firstname: userData?.invoiceInfo?.firstname,
        lastname: userData?.invoiceInfo?.lastname,
    }
    const [data, setData] = useState(initialData)
    useEffect(() => {
        setData(initialData)
    }, [userData])

    const [uploading, setUploading] = useState(false)

    function handleChange(e) {
        if (isLoadingFirstData || uploading) return 

        const { name, value } = e.target
        setData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
        btnSubmit.current.disabled = false
        if (name === 'firstname') {
            if (value.length < 1 || value.length > 30) {
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
            if (value.length < 1 || value.length > 30) {
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
            if (value.length < 1 || value.length > 50) {
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
            if (value.length < 1 || value.length > 50) {
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
            if (value.length < 1 || value.length > 16) {
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
        invoiceError?.current?.classList.remove('shown')
    }

    const firstnameError = useRef(null)
    const lastnameError = useRef(null)
    const adressError = useRef(null)
    const cityError = useRef(null)
    const zipError = useRef(null)
    const invoiceError = useRef(null)
    const btnSubmit = useRef(null)

    async function handleSubmit(e) {
        e.preventDefault()
        btnSubmit.current.disabled = true

        if (uploading) return

        await axios({
            method: 'post',
            url: '/api2/user/billing',
            headers: {
                "Content-Type": "application/json",
            },
            onUploadProgress: function (progressEvent) {
                setUploading(true)
                NProgress.start()
            },
            onDownloadProgress: function (progressEvent) {
                btnSubmit.current.disabled = false
                NProgress.done(false)
                setTimeout(() => {
                    setUploading(false)
                }, 400);
            },
            data: data
        })
            .then(res => {
                // router.push('/user/profile')
                fetchFirstData(false)
            })
            .catch(e => {
                console.error(e)
            })
    }

    return (
        <form className='basic-form shipping-adress' onSubmit={handleSubmit}>
            <h3>Billing Information</h3>
            <div className='input-container'>
                <label htmlFor="firstname">First name:</label>
                <input
                    id='firstname'
                    type="text"
                    placeholder='First name *'
                    onChange={handleChange}
                    name="firstname"
                    value={data.firstname}
                />
                <div
                    ref={firstnameError}
                    className='error'>
                    <p className="general">This field is required. First name cannot contain more than 30 characters.</p>
                    <p className='second'>Cannot contain non-Latin or special characters.</p>
                </div>
            </div>
            <div className='input-container'>
                <label htmlFor="lastname">Last name:</label>
                <input
                    id='lastname'
                    type="text"
                    placeholder='Last name *'
                    onChange={handleChange}
                    name="lastname"
                    value={data.lastname}
                />
                <div
                    ref={lastnameError}
                    className='error'>
                    <p className="general">This field is required. Last name cannot contain more than 30 characters.</p>
                    <p className='second'>Cannot contain non-Latin or special characters.</p>
                </div>
            </div>
            <div className='input-container'>
                <label htmlFor="adress">Adress:</label>
                <input
                    id='adress'
                    type="text"
                    placeholder='Adress *'
                    onChange={handleChange}
                    name="adress"
                    value={data.adress}
                />
                <div
                    ref={adressError}
                    className='error'>
                    <p className="general">This field is required. Adress cannot contain more than 50 characters.</p>
                    <p className='second'>Cannot contain non-Latin characters.</p>
                </div>
            </div>
            <div className='input-container'>
                <label htmlFor="city">City:</label>
                <input
                    id='city'
                    type="text"
                    placeholder='City name *'
                    onChange={handleChange}
                    name="city"
                    value={data.city}
                />
                <div
                    ref={cityError}
                    className='error'>
                    <p className="general">This field is required. City cannot contain more than 50 characters.</p>
                    <p className='second'>Cannot contain non-Latin characters.</p>
                </div>
            </div>
            <div className='input-container'>
                <label htmlFor="zip">Zip code:</label>
                <input
                    id='zip'
                    type="text"
                    placeholder='Zip code *'
                    onChange={handleChange}
                    name="zip"
                    value={data.zip}
                />
                <div
                    ref={zipError}
                    className='error'>
                    <p className="general">This field is required. Zip code cannot contain more than 16 characters.</p>
                    <p className='second'>Cannot contain non-Latin characters.</p>
                </div>
            </div>
            <div className='input-container'>
                <label htmlFor="country">Country:</label>
                <input
                    id='country'
                    type="text"
                    placeholder='Country'
                    onChange={handleChange}
                    name="country"
                    value='Czech Republic'
                    disabled
                />
            </div>
            <button className='submit-btn' type='submit' ref={btnSubmit}>
                Save Information
            </button>
        </form>
    )
}

export default Billing