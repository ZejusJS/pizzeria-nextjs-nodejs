import Link from "next/link"
import { useRouter } from "next/router"
import { createContext, useEffect, useState } from 'react'

import UserSvg from "../../../images/User"
import ArrowLeftSvg from "../../../images/ArrowLeft"
import DollarSvg from "../../../images/Dollar"
import HouseSvg from "../../../images/Houseadress"
import OrderBagSvg from "../../../images/OrderBag"
import NoUserSvg from "../../../images/NoUser"

import Meta from '../../../components/Meta'
import Adress from '../../../components/user/Adress'
import Details from '../../../components/user/Details'
import Billing from '../../../components/user/Billing'
import Orders from '../../../components/user/Orders'
import Spinner from "../../../components/Spinner"

export const UserContext = createContext('')

const index = ({ userData, viewItem, fetchFirstData, isLoadingFirstData }) => {
    const router = useRouter()
    const { slug = [null] } = router.query
    const payIdQuery = router.query?.payId

    const [backUrl, setBackUrl] = useState('/user/profile')
    const [backText, setBackText] = useState('Back')

    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
        fetchFirstData()
        setFirstLoad(false)
    }, [])


    useEffect(() => {
        if (payIdQuery) {
            setBackUrl('/user/profile/orders')
            setBackText('Orders')
        } else {
            setBackUrl('/user/profile')
            setBackText('Back')
        }
    }, [router, slug])

    return (
        <>
            <Meta title='Mamma Mia | Profile' />
            <main className="user-main">
                <section className={`user-container ${!isLoadingFirstData && userData?.email || !firstLoad && userData?.email ? 'shown' : 'hidden'}`}>
                    <div className="user-card">
                        <div>
                            <UserSvg />
                        </div>
                        <div>
                            <h1>{userData?.name}</h1>
                            <h2>{userData?.invoiceInfo?.firstname} {userData?.invoiceInfo?.lastname}</h2>
                            <h4>{userData?.email}</h4>
                        </div>
                    </div>

                    {!slug[0]
                        ?
                        <div className="user-navigation">
                            <Link href={'/user/profile/details'} shallow={true} prefetch={false}>
                                <div>
                                    <UserSvg /><span>User details</span>
                                </div>
                            </Link>
                            <Link href={'/user/profile/orders'} shallow={true} prefetch={false}>
                                <div>
                                    <OrderBagSvg /><span>Orders</span>
                                </div>
                            </Link>
                            <Link href={'/user/profile/adress'} shallow={true} prefetch={false}>
                                <div>
                                    <HouseSvg /><span>Shipping adress</span>
                                </div>
                            </Link>
                            <Link href={'/user/profile/billing'} shallow={true} prefetch={false}>
                                <div>
                                    <DollarSvg /><span>Billing</span>
                                </div>
                            </Link>
                        </div>
                        :
                        <>
                            <button
                                type="button"
                                role="navigation"
                                className="btn-styled back-nav"
                                onClick={() => router.push(`${backUrl}`,
                                    null, { shallow: true })}
                            >
                                <ArrowLeftSvg />
                                <span>{backText}</span>
                            </button>
                        </>
                    }
                    {
                        userData?.email ?
                            slug[0] === 'adress'
                                ?
                                <Adress
                                    shippingAdress={userData?.shippingAdress}
                                    router={router}
                                    fetchFirstData={fetchFirstData}
                                    isLoadingFirstData={isLoadingFirstData}
                                />
                                :
                                slug[0] === 'details'
                                    ?
                                    <Details
                                        router={router}
                                        userData={userData}
                                        fetchFirstData={fetchFirstData}
                                        isLoadingFirstData={isLoadingFirstData}
                                    />
                                    :
                                    slug[0] === 'billing'
                                        ?
                                        <Billing
                                            router={router}
                                            userData={userData}
                                            fetchFirstData={fetchFirstData}
                                            isLoadingFirstData={isLoadingFirstData}
                                        />
                                        :
                                        slug[0] === 'orders'
                                            ?
                                            <Orders
                                                userData={userData}
                                                viewItem={viewItem}
                                                slug={slug}
                                                setBackUrl={setBackUrl}
                                                setBackText={setBackText}
                                                payIdQuery={payIdQuery}
                                            />
                                            :
                                            ''
                            :
                            ''
                    }
                </section>
                <section className={`user-container-loading ${isLoadingFirstData && !userData?.email ? 'show' : 'hidden'}`}>
                    <Spinner />
                </section>
                <section className={`no-auth ${!isLoadingFirstData && !userData?.email ? 'shown' : 'hidden'}`}>
                    <h5>You are not logged in</h5>
                    <NoUserSvg />
                    <div className="links-con">
                        <Link className="login" href={"/user/login"}>
                            Log in
                        </Link>
                        <Link className="signup" href={"/user/signup"}>
                            Sign up
                        </Link>
                    </div>
                </section>
            </main>
        </>
    )
}

export default index

// export const getServerSideProps = async (ctx) => {
//     let userData = {}
//     let error = false

//     await axios({
//         method: 'get',
//         url: `${server}/user/getUser`,
//         // url: `api/cart/getCartAndUser`,
//         withCredentials: true,
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             'Access-Control-Allow-Origin': `${server}`,
//             Cookie: ctx.req.headers.cookie
//         }
//     })
//         .then(res => userData = res.data)
//         .catch(e => {
//             error = true
//         })

//     if (error) {
//         return {
//             redirect: {
//                 permanent: false,
//                 destination: '/user/login'
//             }
//         }
//     }

//     ctx.res.setHeader(
//         'Cache-Control',
//         'public, maxage=100, must-revalidate'
//     )

//     // console.log(userData.orders)
//     return {
//         props: {
//             userData
//         }
//     }
// }