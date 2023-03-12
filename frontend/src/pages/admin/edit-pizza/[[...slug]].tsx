import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import PizzaForm from '../../../components/admin/PizzaForm'
import { server } from '../../../config/config'

const EditPizza = ({
    pizza
}) => {
    const router = useRouter()
    const { slug = [null] } = router.query

    return (
        <main>
            <PizzaForm pizza={pizza} />
        </main>
    )
}

export const getServerSideProps = async (ctx) => {
    let pizzaData
    let error

    await axios({
        method: 'get',
        url: `${server}/admin/pizza/${ctx.query.slug[0]}`,
        headers: {
            'Access-Control-Allow-Origin': `${server}`,
            Cookie: ctx.req.headers.cookie
        }
    })
        .then(res => pizzaData = res.data)
        .catch(e => {
            error = e.response.status
        })


    if (!error) {
        return {
            props: {
                pizza: pizzaData
            }
        }
    }

    if (error === 404) {
        return {
            notFound: true
        }
    } else {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    }
}

export default EditPizza