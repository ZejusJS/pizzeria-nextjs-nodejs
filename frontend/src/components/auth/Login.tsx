import { useEffect, useRef } from 'react'
import axios from 'axios'
import { useState } from 'react'
import NProgress from 'nprogress'
import { useRouter } from 'next/router'

const Login = ({
    user,
    setCart,
    setUser
}) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        newCart: true
    })

    const router = useRouter()

    const emailError = useRef(null)
    const passwordError = useRef(null)
    const authError = useRef(null)

    function handleChange(e) {
        const { name, value } = e.target
        setLoginData(prevData => {
            if (name === 'cart') {
                console.log(prevData.newCart)
                return {
                    ...prevData,
                    newCart: !prevData.newCart
                }
            }
            return {
                ...prevData,
                [name]: value
            }
        })
        if (name === 'password') {
            if (value.length < 8 || value.length > 40) {
                passwordError?.current?.classList.add('shown')
            } else {
                passwordError?.current?.classList.remove('shown')
            }
        }
        if (name === 'email') {
            if (value.length > 100) {
                emailError?.current?.classList.add('shown')
            } else {
                emailError?.current?.classList.remove('shown')
            }
        }
        authError?.current?.classList.remove('shown')
    }

    let submitting = false
    async function handleSubmit(e) {
        axios.defaults.withCredentials = true
        e.stopPropagation()
        e.preventDefault()

        if (submitting) return
        submitting = true

        console.log(loginData)
        await axios({
            method: 'post',
            // url: `${server}/user/login`,
            url: `/api/user/login`,
            headers: {
                "Content-Type": "application/json",
                // 'Access-Control-Allow-Origin': `${server}`
            },
            onUploadProgress: function (progressEvent) {
                NProgress.start()
            },
            onDownloadProgress: function (progressEvent) {
                NProgress.done(false)
            },
            data: loginData
        })
            .then(res => {
                // setUser(prevUser => res.data.user)
                // setCart(prevCart => res.data.cart)
                // router.replace('/')
                if (router.pathname === '/user/login') {
                    window.location.href = "/"
                } else if (router.pathname === '/cart/checkout') {
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
                    passwordError?.current?.classList.add('shown')
                } else if (e.response?.data?.code === 250) {
                    emailError?.current?.classList.add('shown')
                }
                if (e.response?.status === 401) {
                    authError?.current?.classList.add('shown')
                }
                setTimeout(() => {
                    submitting = false
                }, 400);
            })
    }

    return (

        <form noValidate className='auth-form' onSubmit={handleSubmit}>
            <div className='input-container'>
                <label htmlFor="email">Email:</label>
                <input
                    id='email'
                    type="email"
                    placeholder='E-mail'
                    onChange={handleChange}
                    name="email"
                    value={loginData.email}
                />
                <div
                    ref={emailError}
                    className='error'>
                    <p>Email must be valid and cannot contain more than 100 characters.</p>
                </div>
            </div>
            <div className='input-container'>
                <label htmlFor="password">Password:</label>
                <input
                    id='password'
                    type="password"
                    placeholder='Password'
                    onChange={handleChange}
                    name="password"
                    value={loginData.password}
                />
                <div
                    ref={passwordError}
                    className='error'>
                    <p>Password must contain only 8 to 40 characters.</p>
                </div>
                <div
                    ref={authError}
                    className='error'>
                    <p>Email or password are wrong.</p>
                </div>
            </div>
            <div className='input-container checkbox'>
                <label htmlFor="cart">Keep cart?</label>
                <input
                    id='cart'
                    type="checkbox"
                    onChange={handleChange}
                    name="cart"
                    checked={loginData.newCart ? true : false}
                />
            </div>
            <button className='submit-btn' type='submit'>Log In</button>
        </form>

    )
}

export default Login

