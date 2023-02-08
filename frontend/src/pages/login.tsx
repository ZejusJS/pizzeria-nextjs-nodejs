import React from 'react'
import axios from 'axios'
import { server } from '../config/config'
import { useState } from 'react'
import NProgress from 'nprogress'
import router from 'next/router'

const login = ({ user, setUser, setCart }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  function handleChange(e) {
    const { name, value } = e.target
    setLoginData(prevData => {
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
      // url: `${server}/user/login`,
      url: `/api/user/login`,
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
      data: loginData
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
        </div>
        <button className='submit-btn' type='submit'>Log In</button>
      </form>
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


export default login