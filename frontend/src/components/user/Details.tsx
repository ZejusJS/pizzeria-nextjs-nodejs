import axios from 'axios'
import { useRef, useState } from 'react'
import NProgress from 'nprogress'

const Details = ({
    router,
    userData
}) => {
    const [data, setData] = useState({
        name: userData.name,
    })

    function handleChange(e) {
        const { name, value } = e.target
        setData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
        if (name === 'name') {
            if (value.length > 24 || value.length < 1) {
                usernameError?.current?.classList.add('shown')
            } else {
                usernameError?.current?.classList.remove('shown')
            }
        }
    }

    const usernameError = useRef(null)
    const btnSubmit = useRef(null)

    async function handleSubmit(e) {
        e.preventDefault()
        btnSubmit.current.disabled = true

        await axios({
            method: 'post',
            url: '/api2/user/details',
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
        <>
            <form className='basic-form shipping-adress' onSubmit={handleSubmit}>
                <h3>User Details</h3>
                <div className='input-container'>
                    <label htmlFor="login-email">Login email:</label>
                    <input
                        type="text"
                        name="login-email"
                        id="login-email"
                        placeholder='Login email *'
                        value={userData.email}
                        disabled={true}
                    />
                    <div
                        // ref={firstnameError}
                        className='error'>
                        <p>First name cannot contain more than 30 characters.</p>
                    </div>
                </div>
                <div className='input-container'>
                    <label htmlFor="name">Username:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder='Adress *'
                        value={data.name}
                        onChange={handleChange}
                    />
                    <div
                        ref={usernameError}
                        className='error'>
                        <p>This field is required. Username cannot contain more than 24 characters.</p>
                    </div>
                </div>
                <button className='submit-btn' type='submit' ref={btnSubmit}>
                    Save Details
                </button>
            </form>
        </>
    )
}

export default Details