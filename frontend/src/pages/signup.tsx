import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { server } from '../config/config'

const signup = () => {
    const [signData, setSignData] = useState({
        username: '',
        email: '',
        password: ''
    })

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
            url: `${server}/user/signup`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Access-Control-Allow-Origin': `${server}`
            },
            data: signData
        })
            .then(res => console.log(res))
            .catch(e => console.log(e))
    }

    return (
        <div>
            <form noValidate onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='username'
                    onChange={handleChange}
                    name="username"
                    value={signData.username}
                />
                <input
                    type="email"
                    placeholder='email'
                    onChange={handleChange}
                    name="email"
                    value={signData.email}
                />
                <input
                    type="password"
                    placeholder='password'
                    onChange={handleChange}
                    name="password"
                    value={signData.password}
                />
                <button type='submit'>Sign Up</button>
            </form>
        </div>
    )
}

export default signup