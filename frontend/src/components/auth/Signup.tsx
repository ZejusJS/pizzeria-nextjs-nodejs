import axios from 'axios'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { server } from '../../config/config'
import NProgress from 'nprogress'

const Signup = ({ setUser, setOrderDetails }) => {
    const [signData, setSignData] = useState({
        name: '',
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        adress: '',
        city: '',
        zip: '',
    })
    const nameError = useRef(null)
    const emailError = useRef(null)
    const emailTakenError = useRef(null)
    const passwordError = useRef(null)
    const firstnameError = useRef(null)
    const lastnameError = useRef(null)
    const adressError = useRef(null)
    const cityError = useRef(null)
    const zipError = useRef(null)
    const invoiceError = useRef(null)

    let router = useRouter()

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    function handleChange(e) {
        const { name, value } = e.target
        setSignData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
        if (name === 'name') {
            if (value.length < 5 || value.length > 24) {
                nameError?.current?.classList.add('shown')
            } else {
                nameError?.current?.classList.remove('shown')
            }
        }
        if (name === 'password') {
            if (value.length < 8 || value.length > 40) {
                passwordError?.current?.classList.add('shown')
            } else {
                passwordError?.current?.classList.remove('shown')
            }
        }
        if (name === 'email') {
            if (value.length > 100 || !validateEmail(value)) {
                emailError?.current?.classList.add('shown')
            } else {
                emailError?.current?.classList.remove('shown')
            }
            emailTakenError?.current?.classList.remove('shown')
        }
        if (name === 'firstname') {
            if (value.length

                < 1 || value.length > 30) {
                firstnameError?.current?.classList.add('shown')
            } else {
                firstnameError?.current?.classList.remove('shown')
            }
        }
        if (name === 'lastname') {
            if (value.length < 1 || value.length > 30) {
                lastnameError?.current?.classList.add('shown')
            } else {
                lastnameError?.current?.classList.remove('shown')
            }
        }
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

    let submitting = false
    async function handleSubmit(e) {
        axios.defaults.withCredentials = true
        e.stopPropagation()
        e.preventDefault()

        if (submitting) return
        submitting = true
        await axios({
            method: 'post',
            // url: `${server}/user/signup`,
            url: `/api/user/signup`,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': `${server}`
            },
            onUploadProgress: function (progressEvent) {
                NProgress.start()
            },
            onDownloadProgress: function (progressEvent) {
                NProgress.done(false)
            },
            data: signData
        })
            .then(res => {
                // setUser(prevUser => res.data.user)
                // setCart(prevCart => res.data.cart)
                console.log(res)
                // router.replace('/')
                if (router.pathname === '/user/signup') {
                    window.location.href = "/"
                } else if (router.pathname = '/cart/checkout') {
                    // setUser(res.data?.user)
                    // setOrderDetails(res.data?.invoiceInfo)
                    window.location.href = router.asPath
                }
                setTimeout(() => {
                    submitting = false
                }, 400);
            })
            .catch(e => {
                console.log(e)
                if (e.response?.data?.code === 150) {
                    console.log('password incorrect')
                    passwordError?.current?.classList.add('shown')
                } else if (e.response?.data?.code === 200) {
                    console.log('name incorrect')
                    nameError.current?.classList?.add('shown')
                } else if (e.response?.data?.code === 250) {
                    console.log('email incorrect')
                    emailError?.current?.classList.add('shown')
                } else if (e.response?.data?.code === 100) {
                    console.log('email incorrect')
                    emailTakenError?.current?.classList.add('shown')
                } else if (e.response?.data?.code === 300) {
                    console.log('body incorrect')
                    invoiceError?.current?.classList.add('shown')
                }
                setTimeout(() => {
                    submitting = false
                }, 400);
            })
    }

    return (
        <>
            <div>
                <form noValidate className='auth-form' onSubmit={handleSubmit}>
                    <div className='input-container'>
                        <label htmlFor="name">Username:</label>
                        <input
                            type="text"
                            placeholder='Username *'
                            onChange={handleChange}
                            name="name"
                            id='name'
                            value={signData.name}
                        />
                        <div
                            ref={nameError}
                            className='error'>
                            <p>Username must contain only 5 to 24 characters.</p>
                        </div>
                    </div>
                    <div className='input-container'>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            placeholder='E-mail *'
                            onChange={handleChange}
                            name="email"
                            id='email'
                            value={signData.email}
                        />
                        <div
                            ref={emailError}
                            className='error'>
                            <p>Email must be valid and cannot contain more than 100 characters.</p>
                        </div>
                        <div
                            ref={emailTakenError}
                            className='error'>
                            <p>Email is already in use.</p>
                        </div>
                    </div>
                    <div className='input-container'>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            placeholder='Password *'
                            onChange={handleChange}
                            name="password"
                            id='password'
                            value={signData.password}
                        />
                        <div
                            ref={passwordError}
                            className='error'>
                            <p>Password must contain only 8 to 40 characters.</p>
                        </div>
                    </div>

                    <hr />

                    <h3 className='info fw-500'>
                        Billing informations
                    </h3>

                    <div className='input-container'>
                        <label htmlFor="firstname">First name:</label>
                        <input
                            id='firstname'
                            type="text"
                            placeholder='First name *'
                            onChange={handleChange}
                            name="firstname"
                            value={signData.firstname}
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
                            value={signData.lastname}
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
                            value={signData.adress}
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
                            value={signData.city}
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
                            value={signData.zip}
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
                    <div
                        ref={invoiceError}
                        className='error'>
                        <p>Some fields in billing information are missing or are invalid.</p>
                    </div>
                    <button type='submit' className='submit-btn'>Signup</button>
                </form>
            </div>
        </>
    )
}

export default Signup