import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { server } from "../../config/config"
import NProgress from 'nprogress'

import Order from "../../components/admin/Order"
import Spinner from "../../components/Spinner"

import ArrowRightSvg from "../../images/ArrowRight"
import SearchSvg from "../../images/Search"

const orders = ({ ordersData }) => {
    const [orders, setOrders] = useState(ordersData)
    const [pageNum, setPageNum] = useState(ordersData?.page || 1)
    const [search, setSearch] = useState('')
    const router = useRouter()

    // console.log(orders)

    useEffect(() => {
        let { page, q } = router.query
        if (q) setSearch(String(q))

        if (!page) page = '1'

        const fixedPage = Math.floor(Number(page))

        if (router.isReady && !(fixedPage > orders?.totalPages) && fixedPage > 0) {
            NProgress.start()
            axios({
                method: 'get',
                url: `/api2/admin/get-all-orders/${fixedPage}`,
                params: {
                    q: q
                }
            })
                .then(res => {
                    // console.log(res)
                    setOrders(res?.data)
                    setPageNum(res?.data?.page)
                    pagesRef.current.value = Number(router?.query?.page)
                    NProgress.done(false)

                    if (page > res?.data?.totalPages) {
                        router.replace({
                            pathname: router.pathname,
                            query: { ...router.query, page: 1 }
                        }, '', { shallow: true })
                    }
                })
                .catch(e => {
                    console.error(e)
                    NProgress.done(false)
                })
        }
    }, [router.query])

    const pagesRef = useRef(null)

    async function setPage(e, num: number) {
        if (e.target.type === 'number') num = e.target.value

        if (isNaN(num)) num = 2

        let fixedPage = Math.floor(Number(num))

        setPageNum(fixedPage)
        console.log(fixedPage)

        if (fixedPage <= orders?.totalPages && fixedPage > 0) {
            await router.replace({
                pathname: router.pathname,
                query: { ...router.query, page: fixedPage }
            }, '', { shallow: true })
        }
    }

    async function submitSearch(e) {
        e.preventDefault()

        await router.replace({
            pathname: router.pathname,
            query: { ...router.query, q: search, page: 1 }
        }, '', { shallow: true })
    }

    return (
        <main className="orders-main">
            <h1 className="text-cen">All orders</h1>
            <div>
                <form onSubmit={submitSearch}>
                    <div className="search-con">
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="svg-con" type="submit">
                            <SearchSvg />
                        </button>
                    </div>
                </form>
            </div>
            <section className="admin-orders-con">
                {
                    <div className={`spinner-con ${NProgress.status ? 'loading' : ''}`}>
                        <div className="loading-con">
                            <Spinner />
                        </div>
                    </div>
                }
                <div className={`admin-orders ${NProgress.status ? 'loading' : ''}`}>
                    {
                        orders?.docs?.map(order => (
                            <Order
                                key={order?.orderNo + order?.payId}
                                order={order}
                            />
                        ))
                    }
                </div>
                <div className="pages-counter">
                    {router?.query?.page || 1} from {orders?.totalPages} pages
                </div>
                <div className="pagination">
                    <button
                        className={`prev ${orders?.hasPrevPage ? 'work' : ''}`}
                        onClick={(e) => setPage(e, Number(router?.query?.page) - 1)}>
                        <ArrowRightSvg />
                    </button>
                    <input
                        ref={pagesRef}
                        type='number'
                        value={pageNum}
                        onChange={(e) => setPageNum(e.target.value)}
                        onBlur={(e) => setPage(e, null)}
                        onKeyDown={(e) => e.key === 'Enter' ? setPage(e, null) : ''}
                    />
                    <button
                        className={`next ${orders?.hasNextPage ? 'work' : ''}`}
                        onClick={(e) => setPage(e, Number(router?.query?.page) + 1)}>
                        <ArrowRightSvg />
                    </button>
                </div>
            </section>
        </main>
    )
}

// export const getServerSideProps = async (ctx) => {

//     let ordersData = {}
//     let error = false

//     console.log(ctx.query)

//     let page = ctx?.query?.page ? ctx?.query?.page : 1

//     await axios({
//         method: 'get',
//         url: `${server}/admin/get-all-orders/${page}`,
//         withCredentials: true,
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             'Access-Control-Allow-Origin': `${server}`,
//             Cookie: ctx.req.headers.cookie
//         }
//     })
//         .then(res => ordersData = res.data)
//         .catch(e => {
//             error = true
//         })

//     if (error) {
//         return {
//             redirect: {
//                 permanent: false,
//                 destination: '/'
//             }
//         }
//     }

//     return {
//         props: {
//             ordersData
//         }
//     }
// }

export default orders