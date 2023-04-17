import { server } from '../../config/config'

import Login from '../../components/auth/Login'
import Meta from '../../components/Meta'

const login = ({ fetchFirstData, urlsHistory }) => {

  return (
    <>
      <Meta title='Mamma Mia | Login' />
      <main className='login'>
        <h1 className='text-cen'>Login</h1>
        <Login
        urlsHistory={urlsHistory}
        fetchFirstData={() => fetchFirstData(true)}
        />
      </main>
    </>
  )
}

// export const getServerSideProps = async (context) => {
//   return {
//     props: {
//       '1': 1
//     }
//   }
// }


// export async function getStaticProps(context) {
//   return {
//     props: {}, 
//   }
// }

export default login