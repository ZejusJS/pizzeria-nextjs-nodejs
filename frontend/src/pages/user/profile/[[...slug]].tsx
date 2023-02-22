import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { createContext, useRef, useState } from 'react'

import { server } from "../../../config/config"
import UserSvg from "../../../images/User"
import ArrowLeftSvg from "../../../images/ArrowLeft"

import Adress from '../../../components/user/Adress'

export const UserContext = createContext('')

const index = ({ userData }) => {
    const router = useRouter()
    const invoiceInfo = userData.invoiceInfo
    const shippingAdress = userData?.shippingAdress
    const { slug = [null] } = router.query


    console.log(userData)

    return (
        <>
            <main>
                <section className="user-container">
                    <div className="user-card">
                        <div>
                            <UserSvg />
                        </div>
                        <div>
                            <h1>{userData.name}</h1>
                            <h2>{userData.invoiceInfo.firstname} {userData.invoiceInfo.lastname}</h2>
                            <h4>{userData.email}</h4>
                        </div>
                    </div>

                    {!slug[0]
                        ?
                        <div className="navigation">
                            <Link href={'/user/profile/adress'} shallow={true}>
                                <div>
                                    <span>Adress</span>
                                </div>
                            </Link>
                            <Link href={'/user/profile/details'} shallow={true}>
                                <div>
                                    <span>User details</span>
                                </div>
                            </Link>
                        </div>
                        :
                        <>
                            <button
                                type="button"
                                className="btn-styled back-nav"
                                onClick={() => router.push('/user/profile',
                                    null, { shallow: true })}
                            >
                                <ArrowLeftSvg /> 
                                <span>Back to navigation</span>
                            </button>
                        </>
                    }
                    {
                        slug[0] === 'adress'
                            ?
                            <Adress 
                            shippingAdress={shippingAdress}
                            router={router}
                            />
                            : ''
                    }
                </section>
            </main>
        </>
    )
}

export default index

export const getServerSideProps = async (ctx) => {
    let userData = {}
    let error = false

    await axios({
        method: 'get',
        url: `${server}/user/getUser`,
        // url: `api/cart/getCartAndUser`,
        withCredentials: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin': `${server}`,
            Cookie: ctx.req.headers.cookie
        }
    })
        .then(res => userData = res.data)
        .catch(e => {
            error = true
        })

    if (error) {
        return {
            redirect: {
                permanent: false,
                destination: '/user/login'
            }
        }
    }

    return {
        props: {
            userData
        }
    }
}