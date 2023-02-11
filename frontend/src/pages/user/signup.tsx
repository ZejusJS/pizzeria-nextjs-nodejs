import { useRef, useState } from 'react'
import axios from 'axios'
import { server } from '../../config/config'
import NProgress from 'nprogress'
import { useRouter } from 'next/router'

const signup = ({ setUser, user, setCart }) => {
    const [signData, setSignData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const nameError = useRef(null)
    const emailError = useRef(null)
    const emailTakenError = useRef(null)
    const passwordError = useRef(null)

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
                nameError.current.classList.add('shown')
            } else {
                nameError.current.classList.remove('shown')
            }
        }
        if (name === 'password') {
            if (value.length < 8 || value.length > 40) {
                passwordError.current.classList.add('shown')
            } else {
                passwordError.current.classList.remove('shown')
            }
        }
        if (name === 'email') {
            console.log(value)
            if (value.length > 100 || !validateEmail(value)) {
                emailError.current.classList.add('shown')
            } else {
                emailError.current.classList.remove('shown')
            }
            emailTakenError.current.classList.remove('shown')
        }
    }

    async function handleSubmit(e) {
        axios.defaults.withCredentials = true
        e.stopPropagation()
        e.preventDefault()

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
                window.location.href = "/"
            })
            .catch(e => {
                if (e.response?.data?.code === 150) {
                    console.log('password incorrect')
                    passwordError.current.classList.add('shown')
                } else if (e.response?.data?.code === 200) {
                    console.log('name incorrect')
                    nameError.current.classList.add('shown')
                } else if (e.response?.data?.code === 250) {
                    console.log('email incorrect')
                    emailError.current.classList.add('shown')
                } else if (e.response?.data?.code === 100) {
                    console.log('email incorrect')
                    emailTakenError.current.classList.add('shown')
                }
            })
    }

    return (
        <main>
            <div>
                <form noValidate className='auth-form' onSubmit={handleSubmit}>
                    <div className='input-container'>
                        <label htmlFor="name">Username:</label>
                        <input
                            type="text"
                            placeholder='Username'
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
                            placeholder='E-mail'
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
                            placeholder='Password'
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
                    <button type='submit' className='submit-btn'>Sign Up</button>
                </form>
            </div>
        </main>
    )
}

// export const getServerSideProps = async (context) => {
//     return {
//         props: {
//             '1': 1
//         }
//     }
// }

// export async function getStaticProps(context) {
//     return {
//         props: {},
//     }
// }

export default signup