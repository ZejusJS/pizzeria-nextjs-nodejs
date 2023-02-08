import { useState } from 'react'
import axios from 'axios'
import { server } from '../config/config'
import NProgress from 'nprogress'
import { useRouter } from 'next/router'

const signup = ({ setUser, user, setCart }) => {
    const [signData, setSignData] = useState({
        name: '',
        email: '',
        password: ''
    })

    let router = useRouter()

    function handleChange(e) {
        const { name, value } = e.target
        setSignData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
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
                setUser(prevUser => res.data.user)
                setCart(prevCart => res.data.cart)
                console.log(res)
                router.push('/')
            })
            .catch(e => console.log(e))
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
                    </div>
                    <button type='submit' className='submit-btn'>Sign Up</button>
                </form>
            </div>
        </main>
    )
}

export const getServerSideProps = async (context) => {
    return {
        props: {
            '1': 1
        }
    }
}


export default signup