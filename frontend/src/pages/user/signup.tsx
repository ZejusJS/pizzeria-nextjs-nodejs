// import { useRef, useState } from 'react'
// import axios from 'axios'
// import { server } from '../../config/config'
// import NProgress from 'nprogress'
// import { useRouter } from 'next/router'
import Signup from '../../components/auth/Signup'
import Meta from '../../components/Meta'

const signup = ({ setUser, user, setCart }) => {
    return (
        <>
        <Meta title='Mamma Mia | Signup' />
            <main>
                <Signup setOrderDetails setUser={setUser} />
            </main>
        </>
    )
}

// export const getServerSideProps = async (context) => {
//     return {
//         props: {
//             '1': 1
//         }
//     }
// }

// export async function getStaticProps(context) {
//     return {
//         props: {},
//     }
// }

export default signup