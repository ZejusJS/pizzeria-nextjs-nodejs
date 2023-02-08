import React from 'react'
import axios from 'axios'
import { server } from '../config/config'
import { useState } from 'react'

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
      data: loginData
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
      <form noValidate onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder='email'
          onChange={handleChange}
          name="email"
          value={loginData.email}
        />
        <input
          type="password"
          placeholder='password'
          onChange={handleChange}
          name="password"
          value={loginData.password}
        />
        <button type='submit'>Log In</button>
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