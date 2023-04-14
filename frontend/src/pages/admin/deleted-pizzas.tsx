import axios from "axios"
import { server } from "../../config/config"

import AdminPizza from "../../components/admin/AdminPizza"
import PizzaSvg from "../../images/Pizza"


const deletedPizzas = ({ items, viewItem }) => {
    // console.log(items)
    return (
        <main>
            <h1 className="text-cen">Deleted Products</h1>
            {items.map(it => {
                return (
                    <AdminPizza
                        key={it?.title + it?._id}
                        item={it}
                        viewItem={viewItem}
                        PizzaSvg={PizzaSvg} />
                )
            })}
        </main>
    )
}

export const getServerSideProps = async (ctx) => {
    let items
    let error

    await axios({
        method: 'get',
        url: `${server}/admin/get-deleted-pizzas`,
        headers: {
            'Access-Control-Allow-Origin': `${server}`,
            Cookie: ctx.req.headers.cookie
        }
    })
        .then(res => items = res.data)
        .catch(e => {
            error = e.response.status
        })

    if (!error) {
        return {
            props: {
                items: items
            }
        }
    }

    return {
        redirect: {
            permanent: false,
            destination: '/'
        }
    }
}

export default deletedPizzas