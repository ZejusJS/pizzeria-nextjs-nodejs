import { useRef, useState } from "react"
import NProgress from 'nprogress'
import axios from "axios"

const Billing = ({
    userData,
    router
}) => {
    const [data, setData] = useState({
        adress: userData.invoiceInfo.adress,
        zip: userData.invoiceInfo.zip,
        city: userData.invoiceInfo.city,
        firstname: userData.invoiceInfo.firstname,
        lastname: userData.invoiceInfo.lastname,
    })

    function handleChange(e) {
        const { name, value } = e.target
        setData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
        if (name === 'adress') {
            if (value.length < 1 || value.length > 50) {
                adressError?.current?.classList.add('shown')
            } else {
                adressError?.current?.classList.remove('shown')
            }
        }
        if (name === 'city') {
            if (value.length < 1 || value.length > 50) {
                cityError?.current?.classList.add('shown')
            } else {
                cityError?.current?.classList.remove('shown')
            }
        }
        if (name === 'zip') {
            if (value.length < 1 || value.length > 16) {
                zipError?.current?.classList.add('shown')
            } else {
                zipError?.current?.classList.remove('shown')
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

        await axios({
            method: 'post',
            url: '/api/user/billing',
            headers: {
                "Content-Type": "application/json",
            },
            onUploadProgress: function (progressEvent) {
                NProgress.start()
            },
            onDownloadProgress: function (progressEvent) {
                NProgress.done(false)
            },
            data: data
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
                    <p>This field is required. First name cannot contain more than 30 characters.</p>
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
                    <p>This field is required. Last name cannot contain more than 30 characters.</p>
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
                    <p>This field is required. Adress cannot contain more than 50 characters.</p>
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
                    <p>This field is required. City cannot contain more than 50 characters.</p>
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
                    <p>This field is required. Zip code cannot contain more than 16 characters.</p>
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