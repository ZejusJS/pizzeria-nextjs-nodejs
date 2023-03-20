import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/router"
import { createContext } from 'react'

import { server } from "../../../config/config"

import UserSvg from "../../../images/User"
import ArrowLeftSvg from "../../../images/ArrowLeft"
import DollarSvg from "../../../images/Dollar"
import HouseSvg from "../../../images/Houseadress"
import OrderBagSvg from "../../../images/OrderBag"
import DocumentAddSvg from "../../../images/DocumentAdd"
import BackTurnSvg from "../../../images/BackTurn"

import Meta from '../../../components/Meta'
import Adress from '../../../components/user/Adress'
import Details from '../../../components/user/Details'
import Billing from '../../../components/user/Billing'
import Orders from '../../../components/user/Orders'

export const UserContext = createContext('')

const index = ({ userData, viewItem }) => {
    const router = useRouter()
    const shippingAdress = userData?.shippingAdress
    const { slug = [null] } = router.query

    return (
        <>
            <Meta title='Mamma Mia | Profile' />
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
                        <div className="user-navigation">
                            <Link href={'/user/profile/details'} shallow={true}>
                                <div>
                                    <UserSvg /><span>User details</span>
                                </div>
                            </Link>
                            <Link href={'/user/profile/orders'} shallow={true}>
                                <div>
                                    <OrderBagSvg /><span>Orders</span>
                                </div>
                            </Link>
                            <Link href={'/user/profile/adress'} shallow={true}>
                                <div>
                                    <HouseSvg /><span>Shipping adress</span>
                                </div>
                            </Link>
                            <Link href={'/user/profile/billing'} shallow={true}>
                                <div>
                                    <DollarSvg /><span>Billing</span>
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
                                <span>Back</span>
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
                            :
                            slug[0] === 'details'
                                ?
                                <Details
                                    router={router}
                                    userData={userData}
                                />
                                :
                                slug[0] === 'billing'
                                    ?
                                    <Billing
                                        router={router}
                                        userData={userData}
                                    />
                                    :
                                    ''
                    }
                    {
                        slug[0] === 'orders'
                            ?
                            <Orders
                                userData={userData}
                                viewItem={viewItem} 
                                DocumentAddSvg={DocumentAddSvg} 
                                BackTurnSvg={BackTurnSvg}
                            />
                            :
                            ''
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