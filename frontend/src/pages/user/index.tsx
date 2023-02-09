import axios from "axios"
import router from "next/router"
import { server } from "../../config/config"

const index = () => {
    return (
        <div>

        </div>
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
            console.error(e)
            error = true
        })

    if (error) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    }

    return {
        props: {
            '1': 1
        }
    }
}