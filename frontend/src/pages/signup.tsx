import { useState } from 'react'
import axios from 'axios'
import { server } from '../config/config'

const signup = ({ setUser, user, setCart }) => {
    const [signData, setSignData] = useState({
        name: '',
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
            // url: `${server}/user/signup`,
            url: `/api/user/signup`,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': `${server}`
            },
            data: signData
        })
            .then(res => {
                setUser(prevUser => res.data.user)
                setCart(prevCart => res.data.cart)
                console.log(res)
            })
            .catch(e => console.log(e))
    }

    return (
        <main>
            <div>
                <form noValidate onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder='username'
                        onChange={handleChange}
                        name="name"
                        value={signData.name}
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