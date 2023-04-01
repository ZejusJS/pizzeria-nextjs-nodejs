import { useRouter } from "next/router"

import DocumentAddSvg from "../../images/DocumentAdd"
import BackTurnSvg from "../../images/BackTurn"
import { server } from "../../config/config"
import axios from "axios"

const card = () => {
    const router = useRouter()
    console.log(router.query)

    const status = Number(router?.query?.paymentStatus)

    return (
        <main>
            {status === 0 ?
                <div className="payment-issue">
                    <span>&#x203C;</span>
                    Issue with payment
                </div>
                : status === 1 ?
                    <div className="payment-created">
                        <span>
                            <DocumentAddSvg />
                        </span>
                        <div>
                            Payment created
                        </div>
                    </div>
                    : status === 2 ?
                        <div className="payment-progress">
                            <span>
                                <div className="spinner-grow" role="status"></div>
                            </span>
                            Payment in progress
                        </div>
                        : status === 3 ?
                            <div className="payment-cancelled">
                                <span>&#x274C;</span>
                                Payment cancelled
                            </div>
                            : status === 4 ?
                                <div className="payment-confirmed">
                                    <span>
                                        <DocumentAddSvg />
                                    </span>
                                    Payment confirmed
                                </div>
                                : status === 5 ?
                                    <div className="payment-revoked">
                                        <span>&#x274C;</span>
                                        Payment revoked
                                    </div>
                                    : status === 6 ?
                                        <div className="payment-rejected">
                                            <span>&#x274C;</span>
                                            Payment rejected
                                        </div>
                                        : status === 7 || status === 8 ?
                                            <div className="payment-successful">
                                                <span>&#x2714;</span>
                                                Payment was successful
                                            </div>
                                            : status === 9 ?
                                                <div className="payment-progress-refund">
                                                    <span>
                                                        <div className="spinner-grow" role="status"></div>
                                                    </span>
                                                    Refund in progress
                                                </div>
                                                : status === 10 ?
                                                    <div className="payment-refund">
                                                        <span>
                                                            <BackTurnSvg />
                                                        </span>
                                                        Refunded
                                                    </div>
                                                    : ''}

        </main>
    )
}

export const getServerSideProps = async (ctx) => {

    let orderData
    let error
    await axios({
        method: 'get',
        url: `${server}/admin/pizza/${ctx.query.slug[0]}`,
        headers: {
            'Access-Control-Allow-Origin': `${server}`,
            Cookie: ctx.req.headers.cookie
        }
    })
        .then(res => orderData = res.data)
        .catch(e => {
            error = e.response.status
        })

    if (error || !orderData) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    }

    return {
        props: {
            order: orderData
        }
    }
}

export default card